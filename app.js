// our application server
var app = require( 'express' ).createServer( )
    
// a list of messages scrawled on the wall
var msgs = []

// a list of deferred responses 
var defers = []

// / redirects to /q
app.get( '/', function(req, res){
    res.redirect( '/q' )
} )

// /q[/<xxx>] query messages from the wall; may block for a protracted period
app.get( '/q/:ofs?', function(req, res){
    var ofs = parseInt( req.params.ofs ) || 0
    res.contentType( 'text/plain' )
    
    if( msgs.length > ofs ){
        // send all messages on the wall to the user, starting from ofs
        res.send( msgs.slice( ofs ).join( '\n' ) + '\n' )
    }else{
        // waiting for the future; defer until it arrives
        defers.push( [ ofs, res ] )
    }
} )

// /p?msg=<xxx> post a message to the wall
app.get( '/p', function( req, res ){
    var ix, msg = req.query.msg
    if( msg ) msgs.push( msg )
    
    // the future has arrived, notify all those who have deferred
    msg = msg + '\n'
    for( ix in defers ){
        defers[ix].send( msg )
    }
    
    // now purge the deferrals
    defers = []
} )

// listen to port 3000 for traffic.
app.listen( 3000 )