'use strict'

var request = require('request-promise')

function Credentials (input) {
  this.user = input.user
  this.pass = input.pass
  this.id = input.id
  this.secret = input.secret
}

var AppType = {
  WebApp: {value: 0},
  InstalledApp: {value: 1},
  ScriptApp: {value: 2}
}

function Token (input) {
  this.access_token = input.access_token
  this.token_type = input.token_type
  this.expires_in = input.expires_in
  this.scope = input.scope
}

function Connection (token, agent) {
  this.Token = token
  this.Agent = agent
}

function Connect (credentials, agent, appType) {
  if (appType === AppType.ScriptApp) {
    return new Promise(function (resolve, reject) {
      let url = 'https://www.reddit.com/api/v1/access_token'
      request.post(url, {
        auth: { 'user': credentials.id,
                'pass': credentials.secret },
        form: { 'grant_type': 'password',
                'username': credentials.user,
                'password': credentials.pass },
        headers: { 'User-Agent': agent },
        json: true
      })
      .then(function (result) { resolve(new Connection(new Token(result), agent)) })
      .catch(function (err) { reject(err) })
    })
  } else if (appType === AppType.InstalledApp) {
    return new Promise(function (resolve, reject) {
      reject(new Error('InstalledApp not implemented.'))
    })
  } else if (appType === AppType.WebApp) {
    return new Promise(function (resolve, reject) {
      reject(new Error('WebApp not implemented.'))
    })
  } else {
    return new Promise(function (resolve, reject) {
      reject(new Error('Unknown AppType.'))
    })
  }
}

module.exports = {
  Credentials,
  AppType,
  Connect
}
