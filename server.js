'use strict';

const Hapi = require('hapi');
const Path = require('path');

 
const WebService = require('./service/WebService.js');
const CronService = require('./service/CronService.js');
const KeySettingsService = require('./service/KeySettingsService.js');

const wService = new WebService();
const kService = new KeySettingsService();
const cService = new CronService();


const server = new Hapi.Server();
server.connection({ port: 4000, host: '0.0.0.0', routes: {
            
        } 
});

server.state('session', { 
  
  ttl: 1000 * 60 * 60 * 24 
})

server.route({
    method: 'POST',
    path: '/signup',
    handler: function (request, reply) {
         const email = request.payload.email;
         const password = request.payload.password;
         const resp = wService.signUp(email, password, (resp) => { 
            reply(resp).state('session'  , resp.session  );
         });
    }
});



server.route({
    method: 'POST',
    path: '/signin',
    handler: function (request, reply) {
        const email = request.payload.email;
        const password = request.payload.password;
        const resp = wService.signIn(email, password, (resp) => { 
            reply(resp).state('session'  , resp.session  );
         });
    }
});

server.route({
    method: 'POST',
    path: '/awsKey',
    handler: function (request, reply) {
        const aKey = request.payload.aKey;
        const sKey = request.payload.sKey;
        const email = request.payload.email;
        const session = request.state.session;
        wService.isLogin(email, session, (res) => {
             if(res) {
                 kService.write(email, aKey, sKey, (res) => {
                     reply(res);
                 });
             } 
        }); 
    }
});

server.route({
    method: 'POST',
    path: '/sendCron',
    handler: function (request, reply) {
        const aKey = request.payload.aKey;
        const email = request.payload.email;
        const cron = { h : request.payload.h, m : request.payload.m, day : request.payload.day} ;
        const readValue = request.payload.read; 
        const session = request.state.session;
        
        const writeValue = request.state.write;
        const onOff = request.payload.onOff === 'true'; 
        wService.isLogin(email, session, (res) => {
            if(res) {
                cService.AddCronList(email, cron, onOff, readValue, writeValue, ()=> {
                    reply(true); 
                }); 
         }
        });
    }
});

 server.register(require('inert'), (err) => { 
     server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './client'
            }
        }
});
     
     
 });
 

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});