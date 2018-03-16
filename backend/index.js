'use strict';
module.exports = function( server, databaseObj, helper, packageObj) {
	
	const pmx = require('pmx');
	var counter = 0;
	/**
	 * Here server is the main app object
	 * databaseObj is the mapped database from the package.json file
	 * helper object contains all the helpers methods.
	 * packegeObj contains the packageObj file of your plugin. 
	 */

	/**
	 * Initialize the plugin at time of server start.
	 * init method should never have any argument
	 * It is a constructor and is populated once the server starts.
	 * @return {[type]} [description]
	 */
	var init = function(){
		pm2_monit();
		//http://docs.keymetrics.io/docs/pages/custom-metrics/
		var probe = pmx.probe();

		var metric = probe.metric({
			name    : packageObj.monitor.name,
			value   : function() {
				return counter;
			}
		});
		//Testing Loop delay
		setInterval(function() {
			counter++;
		}, 100);


		/* process.on('SIGINT', function() {
			const mongoConnector = server.dataSources.mongodb.connector;
			mongoConnector.connection.close(function () {
				console.log('MongoDb disconnected on app termination');
				process.exit(0);
			});
		 }); */
	};





	const pm2_monit = function(){
		pmx.init({
			http          : true, // HTTP routes logging (default: true)
			ignore_routes : [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
			errors        : true, // Exceptions logging (default: true)
			custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
			network       : true, // Network monitoring at the application level
			ports         : true  // Shows which ports your app is listening on (default: false)
		});
	};


	//return all the methods that you wish to provide user to extend this plugin.
	return {
		init: init
	};
}; //module.exports
