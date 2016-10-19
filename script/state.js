//EventHub propagates events across components in a page.
var EventHub;

(function() {
  //Allows broadcasting events across tabs
  let intercom = Intercom.getInstance();
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
  };
  
  let logger = Logger.get('EventHub');

  //Setup eventhub
  EventHub = {
    _intercomEventName: "EventHub-Event",
    connections: [],
    connect: function() {
      let parentHub = this;
      let connection = {
        listeners: {},
        _delegateToChildren: function(name, parameters) {
          //Get listeners for name
          let listenerList = this.listeners[name];
          if (listenerList !== undefined && listenerList !== null) {
            for (let i = 0; i < listenerList.length; i++) {
              let listener = listenerList[i];
              //TODO Error handling
              listener(parameters);
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
    emit: function(name, parameters, onlyInternal) {
      logger.debug("Received internal event!", name, parameters);
      //Delegate event to children
      this._internalEmit(name, parameters);
      //Do not emit internal events to other tabs/windows
      if(!onlyInternal) {
        //Delegate event to other tabs
        intercom.safeEmit(this._intercomEventName, {
          name: name,
          parameters: parameters
        });
      }
    },
    //Internal function that delegates events to children
    _internalEmit: function(name, parameters) {
      for (let i = 0; i < this.connections.length; i++) {
        let connection = this.connections[i];
        connection._delegateToChildren(name, parameters);
      }
    }
  };
  //Hook eventhub to intercom
  intercom.safeOn(EventHub._intercomEventName, function(data) {
    logger.debug("Received external event!", data.name, data.parameters);
    //Forward event to eventhub but do not rebroadcast to other tabs
    EventHub._internalEmit(data.name, data.parameters);
  });
})();