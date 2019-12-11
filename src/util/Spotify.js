 
    const clientId ="b8c9b7f29f7b496c83f83ac44e29e611";
    const redirectUri = "http://localhost:3000";
    let accessToken = '';
export const Spotify = {
    getAccessToken(){
        if (accessToken){
            return accessToken;
        }else{
            let access_token = window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);    

            if(access_token && expiresInMatch){
                accessToken = access_token[1];
                const expiresIn = Number(expiresInMatch[1]);

                window.setTimeout(()=> {accessToken = '';}, expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            }else{
                window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectUri;
            }
        }
    },

      search(term){
        let token = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
            headers: { Authorization: `Bearer ${token}`}
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse.tracks)
                return [];
            console.log(jsonResponse)
            return jsonResponse.tracks.items.map(track => {
                
                return {id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri};
            })
        })
    },

      savePlaylist(name, tracksArray){

        if(!name && (!tracksArray || tracksArray.length > 99)){
            return;
          }
      
          const accessToken = Spotify.getAccessToken();
          const headers = {Authorization: 'Bearer ' + accessToken};
          let userId;
          return fetch('https://api.spotify.com/v1/me',{headers: headers}).then(response => response.json()
          ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {method: 'POST', headers: headers, body: JSON.stringify({name: name, public: true})}
            ).then(response =>
              response.json()
            ).then(jsonResponse => {
              let playlistId=jsonResponse.id;
             
              return fetch(	`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks` , {method:'POST', 'headers': headers, body: JSON.stringify({'uris':tracksArray}) }).then( response => {
                return response.json();
              });
            });
          });

    }
    
}