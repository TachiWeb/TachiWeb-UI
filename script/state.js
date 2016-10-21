//SharedWorkerIntercom implementation
var SWIntercom;
(function() {
  SWIntercom = {
    worker: null,
    origin: Util.guid(),
    listeners: [],
    supported: true,
    init: function() {
      if(SharedWorker) {
        this.worker = new SharedWorker('/script/swintercom.js');
        this.worker.port.addEventListener('message', function(e) {
          this._internalEmit(e.data.name, e.data.data);
        }.bind(this), false);
        this.worker.port.start();
      } else {
        this.supported = false;
      }
      delete this.init;
      return this;
    },
    _internalEmit: function(name, data) {
      for(let listener of this.listeners) {
        if(listener.name === name) {
          listener.listener(data);
        }
      }
    },
    emit: function(name, data) {
      this.worker.port.postMessage({
        name: name,
        data: data
      });
    },
    on: function(name, listener) {
      this.listeners.push({name: name, listener: listener});
    }
  }.init();
})();

//EventHub propagates events across components in a page and other browser windows/tabs
var EventHub;

(function() {
  //Allows broadcasting events across tabs (use swintercom if it is supported)
  let intercom;
  if(SWIntercom.supported) {
    intercom = SWIntercom;
  } else {
    intercom = Intercom.getInstance();
  }
  //Intercom events that do not duplicate for the current tab/window
  intercom.safeOn = function(name, listener) {
    intercom.on(name, function(data) {
      if (data.origin !== intercom.origin) {
        listener(data.data);
      }
    });
  };
  intercom.safeEmit = function(name, data) {
    intercom.emit(name, {
      origin: intercom.origin,
      data: data
    });
  }
  
  let logger = Logger.get('EventHub');

  //Setup eventhub
  EventHub = {
    _intercomEventName: "EventHub-Event",
    connections: [],
    connect: function() {
      let parentHub = this;
      let connection = {
        listeners: {},
        _delegateToChildren: function(name, parameters, internal) {
          //Get listeners for name
          let listenerList = this.listeners[name];
          if (listenerList !== undefined && listenerList !== null) {
            for (let i = 0; i < listenerList.length; i++) {
              let listener = listenerList[i];
              //TODO Error handling
              listener(parameters, internal);
            }
          }
        },
        //Add listener
        on: function(name, listener) {
          let listenerList = this.listeners[name];
          if (listenerList === undefined || listenerList === null) {
            listenerList = [];
            this.listeners[name] = listenerList;
          }
          listenerList.push(listener);
        },
        disconnect: function() {
          parentHub.disconnect(this);
        },
        destroy: function() {
          parentHub.disconnect(this);
        },
        close: function() {
          parentHub.disconnect(this);
        },
        emit: function(name, parameters) {
          parentHub.emit(name, parameters);
        }
      };
      this.connections.push(connection);
      return connection;
    },
    //Disconnect child hub from main hub
    disconnect: function(connection) {
      let index = this.connections.indexOf(connection);
      if (index > -1) {
        this.connections.splice(index, 1);
      }
    },
    //Receieve event and delegate to children
    emit: function(name, parameters, internalOnly) {
      logger.debug("Received internal event!", name, parameters);
      //Delegate event to children
      this._internalEmit(name, parameters, true);
      //Do not emit internal events to other tabs/windows
      if(!internalOnly) {
        //Delegate event to other tabs
        intercom.safeEmit(this._intercomEventName, {
          name: name,
          parameters: parameters
        });
      }
    },
    //Internal function that delegates events to children
    _internalEmit: function(name, parameters, internal) {
      for (let i = 0; i < this.connections.length; i++) {
        let connection = this.connections[i];
        connection._delegateToChildren(name, parameters, internal);
      }
    }
  };
  //Hook eventhub to intercom
  intercom.safeOn(EventHub._intercomEventName, function(data) {
    logger.debug("Received external event!", data.name, data.parameters);
    //Forward event to eventhub but do not rebroadcast to other tabs
    EventHub._internalEmit(data.name, data.parameters, false);
  });
})();