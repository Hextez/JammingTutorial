import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';

export class Playlist extends React.Component {
    constructor(props){
        super(props);
        
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(e){
        console.log(e.target.value)
        this.props.onNameChange(e.target.value);
    }

    render(){
        return(<div className="Playlist">
                    <input value={this.playlistName} onChange={this.handleNameChange} type="text" />
                    <TrackList searchResults={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                    <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
                </div>);
    }
}