import React, { Component } from 'react';
import DropZone from 'react-dropzone';
import EXIF from 'exif-js';
import logo from './logo.svg';
import './App.css';


class ExifRow extends React.Component {
  render() {
    const val = this.props.value;
    return (
      <li>
        {this.props.name}:  <i>{val.toString()}</i>
      </li>
    );
  }
}


class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image_src: null, exif: [] };
  }

  componentDidMount() {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      this.setState({ image_src: e.target.result });
    };
    reader.onloadend.bind(this);
    reader.readAsDataURL(this.props.image);

    const reader2 = new FileReader();
    reader2.onloadend = (e) => {
      this.setState({ exif: EXIF.readFromBinaryFile(e.target.result) });
    };
    reader2.onloadend.bind(this);
    reader2.readAsArrayBuffer(this.props.image);
  }

  render() {
    const liStyle = {
      listStyleType: 'none',
      margin: '20px 20px 0px 20px',
      padding: '20px',
      backgroundColor: '#fafafa',
    };
    const imgStyle = {
      maxWidth: '80%',
    };
    let exifItems = [];
    Object.keys(this.state.exif).forEach((key) => {
      const val = this.state.exif[key];
      exifItems.push(<ExifRow name={key} value={val} />);
      //console.log(exifItems);
    });
    return (
      <li style={liStyle}>
        {this.state.image_src ?
          <div>
            <img src={this.state.image_src} alt="sdg" style={imgStyle} />
            {this.state.exif ?
              <ul>
                {exifItems}
              </ul>
              :
              <div>No metadata.</div>
            }
          </div>
          :
          <div>Nope</div>
        }
      </li>
    );
  }
}


class ImageList extends React.Component {
  render() {
    let items = [];
    this.props.images.forEach((image) => {
      items.push(
        <Image
          image={image}
          key={image.name + image.lastModified}
        />);
    });
    return (
      <div>
        <p>Analysed images:</p>
        <ul style={{ padding: 0, margin: 0 }}>
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

  // static data for testing
  /*
  componentDidMount() {
    let IMAGES = []
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/30_flickr-cats.jpg');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onloadend = (e) => {
      IMAGES.push(
        new File(
          [e.target.response],
          'cat.jpg',
          { type: e.target.response.type }),
         );
      IMAGES.push(
        new File([e.target.response],
           'cat2.jpg',
           { type: e.target.response.type }));
      this.setState({ files: IMAGES });
    };
  }
  */

  handleDrop(files) {
    this.setState({ files: files });
  }

  render() {
    const DZstyle = {
      width: '80%',
      height: 200,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
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
            <FilterableImageList images={this.state.files} />
          </div>
          :
          ''
        }
      </div>
    );
  }
}

export default App;
