import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';


const app = new Clarifai.App({
  apiKey: '9ffadbe283364b12bb84351e5621ea46'
 });
 

const particlesOptions={
  "particles": {
    "number":{
      "value":150,
      "density":{
        "enable":true,
        "value_area":800
      }
    }
  },
  "interactivity":{
    "detect_on": "window",
   "events": {
    "onhover":{
      "enable":true,
      "mode":"repulse"
    },
    "onclick":{
      "enable":true,
      "mode":"push"
    },
    "modes": {
      "grab": {
          "distance": 400,
          "line_linked": {
              "opacity": 1
          }
      },
      "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
      },
      "repulse": {
          "distance": 100,
          "duration": 0.4
      },
      "push": {
          "particles_nb": 4
      },
      "remove": {
          "particles_nb": 2
      }
  }
}},
"retina_detect": true
}

class App extends Component{
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false
    }
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputImage');
    const width=Number(image.width);
    const height=Number(image.height);
    return{
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height),
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box})
  }

  onInputChange=(event)=>{
this.setState({input:event.target.value})
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err=> console.log(err));
  }


  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  render(){
  return (
    <div className="App">
    <Particles className='particles' params={particlesOptions} />
    <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
    { this.state.route==='home'?
    <div>
    <Logo />
    <Rank />
    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
    <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
    </div> :
    this.state.route==='signin'?
    <SignIn onRouteChange={this.onRouteChange} />
    :<Register onRouteChange={this.onRouteChange} />
      }
    </div>
  );
}
}

export default App;