import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AssetService from '../../services/AssetService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Storage } from '../../firebase';
import FileUploader from "react-firebase-file-uploader";

class ManageAssets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      uploading: false,
      assets: null,
      models: null,
    };

    this.getMetadata = this.getMetadata.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteModel = this.deleteModel.bind(this);
    this.deleteTexture = this.deleteTexture.bind(this);
    this.deleteMap = this.deleteMap.bind(this);
    this.getTextureAssetContent = this.getTextureAssetContent.bind(this);
    this.getModelAssetContent = this.getModelAssetContent.bind(this);
    this.getMapAssetContent = this.getMapAssetContent.bind(this);
    this.getFileSize = this.getFileSize.bind(this);
  }

  componentDidMount() {
    this.getMetadata();
  }

  async getMetadata() {
    const textureMetadata = await AssetService.getTextureMetadata();
    const modelMetadata = await AssetService.getModelMetadata();
    const mapMetadata = await AssetService.getMapMetadata();

    this.setState({
      loading: false,
      textureMetadata,
      modelMetadata,
      mapMetadata,
    });
  }

  async deleteTexture(texture) {
    await AssetService.removeTexture(texture);
    toast.success('Successfully removed texture');
  }

  async deleteModel(model) {
    await AssetService.removeModel(model);
    toast.success('Successfully removed model');
  }

  async deleteMap(map) {
    await AssetService.removeMap(map);
    toast.success('Successfully removed map');
  }

  handleUploadStart = () => this.setState({ uploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ uploading: false });
    toast.error(error);
  };

  handleModelUploadSuccess = async (filename, task) => {
    const location = await task.ref_.getDownloadURL();    
    await AssetService.createModel(filename, task.metadata_.size, location);

    this.setState({ progress: 100, uploading: false });
    toast.success('Model uploaded successfully');
  };

  handleTextureUploadSuccess = async (filename, task) => {
    const location = await task.ref_.getDownloadURL();
    await AssetService.createTexture(filename, task.metadata_.size, location);

    this.setState({ progress: 100, uploading: false });
    toast.success('Texture uploaded successfully');
  };

  handleMapUploadSuccess = async (filename, task) => {
    const location = await task.ref_.getDownloadURL();    
    await AssetService.createMap(filename, task.metadata_.size, location);

    this.setState({ progress: 100, uploading: false });
    toast.success('Map uploaded successfully');
  };

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  getFileSize(size) {
    const i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

  getTextureAssetContent(asset) {
    return (
      <tr className="abasi-assets-row" key={asset.id}>
        <td>{ asset.filename }</td>
        <td>{ asset.id }</td>
        <td>{ this.getFileSize(asset.size) }</td>
        <td>
          <a href={asset.location} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </td>

        <td>
          <button className="abasi-assets-table-button" onClick={() => { this.deleteTexture(asset.id) }}>
            Delete Asset
          </button>
        </td>
      </tr>
    );
  }

  getModelAssetContent(asset) {
    return (
      <tr className="abasi-assets-row" key={asset.id}>
        <td>{ asset.filename }</td>
        <td>{ asset.id }</td>
        <td>{ this.getFileSize(asset.size) }</td>
        <td>
          <a href={asset.location} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </td>

        <td>
          <button className="abasi-assets-table-button" onClick={() => { this.deleteModel(asset.id) }}>
            Delete Asset
          </button>
        </td>
      </tr>
    );
  }

  getMapAssetContent(asset) {
    return (
      <tr className="abasi-assets-row" key={asset.id}>
        <td>{ asset.filename }</td>
        <td>{ asset.id }</td>
        <td>{ this.getFileSize(asset.size) }</td>
        <td>
          <a href={asset.location} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </td>

        <td>
          <button className="abasi-assets-table-button" onClick={() => { this.deleteMap(asset.id) }}>
            Delete Asset
          </button>
        </td>
      </tr>
    );
  }

  getManageContent() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="abasi-manage-assets loading flex columns">
          <ClipLoader />
          <p>Loading asset metadata...</p>
        </div>
      );
    }

    const textureContent = _.map(this.state.textureMetadata, this.getTextureAssetContent);
    const modelContent = _.map(this.state.modelMetadata, this.getModelAssetContent);
    // const mapContent = _.map(this.state.mapMetadata, this.getMapAssetContent)

    return (
      <div className="abasi-manage-assets flex columns">
        <h1>Manage Textures</h1>
  
        <table className="abasi-assets-table abasi-table" border="1" frame="void" rules="rows">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset ID</th>
              <th>File Size</th>
              <th>Link</th>
              <th>Delete Asset</th>
            </tr>
          </thead>
  
          <tbody>
            { textureContent }
          </tbody>
        </table>

        <h1>Manage Models</h1>

        <table className="abasi-assets-table abasi-table" border="1" frame="void" rules="rows">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset ID</th>
              <th>File Size</th>
              <th>Link</th>
              <th>Delete Asset</th>
            </tr>
          </thead>
  
          <tbody>
            { modelContent }
          </tbody>
        </table>

        {/* <h1>Manage Maps</h1>

        <table className="abasi-assets-table abasi-table" border="1" frame="void" rules="rows">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset ID</th>
              <th>File Size</th>
              <th>Delete Asset</th>
            </tr>
          </thead>
  
          <tbody>
            { mapContent }
          </tbody>
        </table> */}
      </div>
    );
  }

  getModelContent() {
    return (
      <div className="abasi-upload-model flex columns">
        <h1>Upload Model</h1>
        
        <label htmlFor="model">
          <span className="label">
            Choose File: 
          </span>

          <FileUploader
            accept=".fbx,.obj"
            name="model"
            storageRef={Storage.ref('models')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleModelUploadSuccess}
            onProgress={this.handleProgress}
          />
        </label>
      </div>
    );
  }

  getTextureContent() {
    return (
      <div className="abasi-upload-texture flex columns">
        <h1>Upload Texture</h1>
        
        <label htmlFor="texture">
          <span className="label">
            Choose File: 
          </span>

          <FileUploader
            accept="image/*"
            name="texture"
            storageRef={Storage.ref('textures')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleTextureUploadSuccess}
            onProgress={this.handleProgress}
          />
        </label>
      </div>
    );
  }

  getMapContent() {
    return (
      <div className="abasi-upload-map flex columns">
        <h1>Upload Map</h1>
        
        <label htmlFor="map">
          <span className="label">
            Choose File: 
          </span>

          <FileUploader
            accept="image/*"
            name="map"
            storageRef={Storage.ref('maps')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleMapUploadSuccess}
            onProgress={this.handleProgress}
          />
        </label>
      </div>
    );
  }

  render() {
    return (
      <div className="flex columns abasi-assets">
        <h1>Asset Management</h1>

        <Tabs>
          <TabList>
            <Tab>Manage Assets</Tab>
            <Tab>Upload Model</Tab>
            <Tab>Upload Texture</Tab>
            {/* <Tab>Upload Map</Tab> */}
          </TabList>

          <TabPanel>
            { this.getManageContent() }
          </TabPanel>

          <TabPanel>
            { this.getModelContent() }
          </TabPanel>

          <TabPanel>
            { this.getTextureContent() }
          </TabPanel>

          {/* <TabPanel>
            { this.getMapContent() }
          </TabPanel> */}
        </Tabs>
      </div>
    );
  }
}

export default ManageAssets;
