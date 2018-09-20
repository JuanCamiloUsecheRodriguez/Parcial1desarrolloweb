import React, { Component } from 'react';
import './App.css';
//mis imports
import Objeto from './componentes/Objeto';
import vegaEmbed from 'vega-embed';


class App extends Component {

  //Aqui vamos a utilizar el state
  constructor(props){
    super(props);
    this.state= {
      //Aqui indicamos lo que vamos a usar en el state
      //Antes de probar la conexion a la  base de datos usamos un objeto de prueba
      JSON: '',
    };
    this.change = this.change.bind(this);
  }

  //Despues de que renderizo llamo a este metodo ... NPI de que es esto? leer sobre el ciclo de vida
  componentDidMount(){    
     
  }
  change (event) {
    const target = event.target;
    const value = target.value;
    this.setState({
      [event.target.name]: value
    });
  }

  renderGraphs(){
    var spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      "description": "A simple bar chart with embedded data.",
      "data": {
        "name": "myData" 
      },
      "mark": "bar",
      "encoding": {
        "y": {"field": "a", "type": "ordinal"},
        "x": {"field": "b", "type": "quantitative"}
      }};
    const embed_opt = {"mode": "vega-lite"}; 
    try{
    JSON.parse(this.state.JSON);
    spec.data = JSON;
    }
    catch(error){
      window.alert("EL INPUT NO ES UN JSON");
    }
    vegaEmbed(this.div, spec, embed_opt)
      .then(function (result) {
      console.log(result);
    }).catch(console.error);
  }
  
  render() {
    return (
      <div className="App">
        <h1>Versión minimalista de vega-lite editor</h1>
        {/* Aqui puedo empezar a cargar mis componentes para construir mi APP :D */}
        <input name ="JSON  " type="text" value={this.state.JSON} onChange={this.change} />
        {this.renderGraphs()}
        <div ref={(div) => this.div=div}></div>
      </div>
    );
  }
}

export default App;
