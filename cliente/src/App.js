import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';
import Papa from 'papaparse';


class App extends Component {
  constructor(props){
    super(props);
    this.state= {
      JSON: '',
      myData: '',
      rates: [
        {  name: "Jhon", rate: 5}
      ],
      jsonrecords: [
        [
          {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
          {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
          {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
        ]
      ],
      file:null
      
    };

    this.change = this.change.bind(this);
    this.renderGraphsJSON = this.renderGraphsJSON.bind(this);
    this.renderGraphsCSV = this.renderGraphsCSV.bind(this);
    this.rate = this.rate.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(){    
    fetch('/getData')
      .then((res)=>res.json() )
      .then((json)=> this.setState({rates:json}))
      .catch((err) => console.log(err)); 
  }
  change (event) {
    this.setState({
      JSON: event.target.value,
    });
  }

  renderGraphsJSON(e){
    var spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.0.0-rc6.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'name': 'myData' 
      },
      'mark': 'bar',
      'encoding': {
        'y': {'field': 'a', 'type': 'ordinal'},
        'x': {'field': 'b', 'type': 'quantitative'}
      }
    };
    /** PARA PROBAR UN JSON
    [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
    ]
	*/
    console.log(this.state.JSON);
    try{
      this.setState({
        myData: JSON.parse(this.state.JSON),
      });
      vegaEmbed(this.div, spec).catch(error => console.log(error))
        .then((res) =>  res.view.insert('myData', this.state.myData).run());
      //vamos a guardar el JSON en la bd
      fetch('/api/savejson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          JSON: this.state.myData,
        }),
      }).then(res => res.json())
        .then(json => {
          console.log('json', json);
        });
    }
    catch(error){
      window.alert('EL INPUT NO ES UN JSON');
    }
  }
  
  renderGraphsCSV(e){
    var spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.0.0-rc6.json',
      'description': 'A simple bar chart with embedded data.',
      'data': {
        'name': 'myData' 
      },
      'mark': 'bar',
      'encoding': {
        'y': {'field': 'a', 'type': 'ordinal'},
        'x': {'field': 'b', 'type': 'quantitative'}
      }
    };
    try{
      Papa.parse(this.state.file, {
        download: true,
        header: true,
        complete: function(results) {
          const datos= results.data;
          this.setState({
            myData: datos,
          });
          console.log(this.state.myData);
          vegaEmbed(this.div, spec).catch(error => console.log(error))
            .then((res) =>  res.view.insert('myData', this.state.myData).run());
        }.bind(this)
      }
      );
      /** 
      console.log(this.state.file);
      fetch('/api/savecsv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          CSV: this.state.file,
        }),
      }).then(res => res.json())
        .then(json => {
          console.log('json', json);
        });
        */
    }
    catch(error){
      window.alert('El archivo no es correcto');
    }
  }
  rate(e){
    const promptname = prompt('What is your name?');
    const promptrating = prompt('Rathe the app with a numer from 1 to 5');
    console.log(promptname);
    console.log(promptrating);
    // Post request to backend
    /** 
    fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: promptname,
        rate: promptrating
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
      });
    window.alert('Your review has been saved');
    this.componentDidMount(); */
  }

  renderReviews(){
    return this.state.rates.map((rat) => 
      <div key={rat.name}>{rat.name}-{rat.rate} </div>
    );
  }

  renderJSONRecords(){
   
  }
  
  onChange(e) {
    this.setState({file:e.target.files[0]});
  }

  render() {
    return (
      <div className="App">
        <h1>Versión minimalista de vega-lite editor</h1>
        <h2>Copy your JSON here</h2>
        <p>Make sure to enclose it with [], use this example</p>
        <br/>
        <input name ="JSON  " type="text" value={this.state.JSON} onChange={this.change} />
        <button className="nav_btn"  onClick={e=>this.renderGraphsJSON(e)}>Generate graph using your JSON</button>
        <h2>Upload a csv file</h2>
        <input type="file" onChange={this.onChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        <br/>
        <br/>
        <button className="nav_btn"  onClick={e=>this.renderGraphsCSV(e)}>Generate graph using your CSV</button>
        <div ref={(div) => this.div=div}></div>
        <br/>
        <h2>JSON records</h2>
        <br/>
        {this.renderJSONRecords()}
        <br/>
        <h2>CSV records</h2>
        <h2>User's reviews</h2>
        <br/>
        {this.renderReviews()}
        <br/>
        <button className="nav_btn"  onClick={e=>this.rate(e)}>Rate the app</button>
      </div>
    );
  }
}

export default App;
