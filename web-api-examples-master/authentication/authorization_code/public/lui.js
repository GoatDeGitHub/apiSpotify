// lui.js

var user = null;


$(document).ready(function() {
  // Déclaration de la variable access_token à une portée globale
  var access_token = null;

  /**
   * Obtient les paramètres du hash de l'URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

  var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();

  access_token = params.access_token;
  var refresh_token = params.refresh_token;
  var error = params.error;

  if (error) {
    alert('Il y a eu une erreur lors de l\'authentification');
  } else {
    if (access_token) {
      // Rendre les informations d'authentification
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          $('#login').hide();
          $('#loggedin').show();
          user = response; // stocker l'utilisateur dans une variable globale
          console.log(user);
          window.user = user; // exporter la variable user
        }
      });
    } else {
      // Rendre l'écran initial
      $('#login').show();
      $('#loggedin').hide();
    }

    function displayPlaylists(playlists) {
      // Récupérer l'élément HTML de la liste de lecture
      var playlistsElement = document.getElementById('playlists');
    
      // Boucle à travers les playlists
      for (var i = 0; i < playlists.items.length; i++) {
        // Créer un élément HTML pour chaque playlist
        var playlist = playlists.items[i];
        var playlistElement = document.createElement('div');
    
        // Ajouter le nom de la playlist à l'élément HTML
        var nameElement = document.createElement('h2');
        nameElement.innerHTML = playlist.name;
        playlistElement.appendChild(nameElement);
    
        // Ajouter l'image de la playlist à l'élément HTML
        var imageElement = document.createElement('img');
        imageElement.setAttribute('src', playlist.images[0].url);
        playlistElement.appendChild(imageElement);
    
        // Ajouter l'élément de la playlist à la liste de lecture HTML
        playlistsElement.appendChild(playlistElement);
      }
    }

    function displayTopArtists(artistData) {
      console.log("copn artiste");
      // Récupérer l'élément HTML pour les artistes
      var artistElement = document.getElementById('top-artists');
      
      // Boucle à travers les artistes
      for (var i = 0; i < artistData.items.length; i++) {
        // Créer un élément HTML pour chaque artiste
        var artist = artistData.items[i];
        var artistElement = document.createElement('div');
        
        // Ajouter le nom de l'artiste à l'élément HTML
        var nameElement = document.createElement('h2');
        nameElement.innerHTML = artist.name;
        artistElement.appendChild(nameElement);
        
        // Ajouter l'image de l'artiste à l'élément HTML
        var imageElement = document.createElement('img');
        imageElement.setAttribute('src', artist.images[0].url);
        artistElement.appendChild(imageElement);
        
        // Ajouter l'élément de l'artiste à la liste d'artistes HTML
        artistElement.appendChild(artistElement);
      }
    }

    function displaySongMostListenShort(artisteData){
      var songsElement = document.getElementById('top-song');

      for (var i=0; i<artisteData.items.length; i++){

        var song = artisteData.items[i];
        var songElement = document.createElement('div');

        //nom musique
        var nameElement = document.createElement('h2');
        nameElement.innerHTML = song.name;
        songElement.appendChild(nameElement);

        //nom artiste 
        var nameElement2 = document.createElement('h3');
        nameElement2.innerHTML = song.artists[0].name;
        songElement.appendChild(nameElement2);

        //nombre écoute
        var nameElement3 = document.createElement('p');
        nameElement3.innerHTML = "Listens : " + song.popularity;
        songElement.appendChild(nameElement3);

        //test 
        var nameElement4 = document.createElement('p');
        nameElement4.innerHTML = song.msPlayed;
        songElement.appendChild(nameElement4);

        var imageElement = document.createElement('img');
        imageElement.setAttribute('src', song.album.images[0].url);
        songElement.appendChild(imageElement);
        console.log(song.msPlayed);

        

        
        // Ajouter l'élément de l'artiste à la liste d'artistes HTML
        songsElement.appendChild(songElement);
      }
    }
    


    $.ajax({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        console.log("cbon playlist");
        // Afficher les playlists
        displayPlaylists(response);
      }
    });

    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        console.log(response.items); 
        displaySongMostListenShort(response);
      },
      error: function(error) {
        console.error(error);
      }
    });
    
    
  }
});

  
  