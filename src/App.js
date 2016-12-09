import React, { Component } from 'react';
import DropZone from 'react-dropzone';
import logo from './logo.svg';
import './App.css';



class Image extends React.Component {
  constructor(props) {
    super(props)
    this.state = {image_src: null}
  }

  componentDidMount() {
    var reader = new FileReader();
    reader.onloadend = (e) => {
      this.setState({image_src: e.target.result})
      console.log(e.target)
    }
    reader.onloadend.bind(this)
    reader.readAsDataURL(this.props.image);
  }

  render () {
    const liStyle = {
      listStyleType: 'none',
      margin: '20px 20px 0px 20px',
      padding: '20px',
      backgroundColor: '#ccc'
    }
    return (
      <li style={liStyle}>
        {this.state.image_src ?
          <div>
            <div>{this.props.image.name}</div>
            <img src={this.state.image_src} alt="sdg" />
          </div>
          :
          <div>Nope</div>
        }
      </li>
      )
  }
}
class ImageList extends React.Component {
  render() {
    var items = [];
    this.props.images.forEach(function(image) {
      items.push(<Image
        image={image}
        key={image.name + image.lastModified} />);
    });
    return (
      <div>
        <p>Analysed images:</p>
        <ul style={{padding: 0, margin: 0}}>
          {items}
        </ul>
      </div>
    );
  }
}


class SearchBar extends Component {
  render() {
      return (
        <form>
          <input type="text" placeholder="Search..." />
        </form>
      );
    }
}


class FilterableImageList extends Component {
  render() {
    return (
      <div>
        <SearchBar />
        <ImageList images={this.props.images} />
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {files: null}
    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDrop(files) {
    this.setState({files: files});
  }

  // static data for testing
  componentDidMount() {
    var IMAGES = []
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/30_flickr-cats.jpg');
    xhr.responseType = "blob"
    xhr.send()
    xhr.onloadend = (e) => {
      IMAGES.push(
        new File([e.target.response],
           'cat.jpg',
           {type: e.target.response.type})
         )
      IMAGES.push(
        new File([e.target.response],
           'cat2.jpg',
           {type: e.target.response.type}))
      this.setState({files: IMAGES})
    }
  }

  render() {
    const DZstyle = {
        width: '80%',
        height: 200,
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5
      };
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Metadata Viewer</h2>
        </div>
        <p className="App-intro">
          Drag and drop images to see their metadata. The data will never
          leave your computer.
        </p>
        <div>
          <DropZone onDrop={this.handleDrop} style={DZstyle} >
            <div>Try dropping some files here, or click to select files to upload.</div>
          </DropZone>
        </div>
        <hr />
        {this.state.files ?
          <div>
            <FilterableImageList images={this.state.files}/>
          </div>
          :
          <div>Waiting</div>
        }
      </div>
    );
  }
}

export default App;
