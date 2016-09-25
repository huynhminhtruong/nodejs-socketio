var cluster = require('cluster')
var cpus = require('os').cpus().length

console.log('Number of cpu: ')
console.log(cpus)