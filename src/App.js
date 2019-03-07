import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { Form, Input, Row, Col, Spin, Typography, message} from 'antd';
import "antd/dist/antd.css";
import Web3 from 'web3';
import Recaptcha from 'react-google-invisible-recaptcha';

const InputGroup = Input.Search;
const web3 = new Web3("http://rpc.testnet.nexty.io:8545");
class App extends Component {
  constructor(props) {
	  super(props);
		this.state = {status: "", disabled: false, address: ""}
		this.onResolved = this.onResolved.bind(this);
  }
  componentDidMount() {
  }
  givemeNTY = function (address) {
		this.setState({disabled:true});
		this.setState({address});
		if (!web3.utils.isAddress(address)) {
			message.error("Invalid address",2);
			this.recaptcha.reset();
		}else{
			this.recaptcha.execute();
		}
	}
  onResolved() {
			var self = this;
			fetch('http://localhost:3000/requestnty', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({address:this.state.address,captcha:this.recaptcha.getResponse()})
			})
			.then(response => response.json())
			.then(function(response) {
				self.setState({disabled:false});
				if (response.error) {
					message.error(response.error);
				}else{
					message.success("Faucet sent:" + response.tx,5);
				}
			})
			.catch(function(error) {
				self.setState({disabled:false});
				message.error("There is some problem during execution",2);
			})
  }
  render() {
    return (
		<div className="App">
        <header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1>Faucet for Nexty Testnet</h1>
					<Row>
						<Col lg={{span:12,offset:6}} xs={{span:20,offset:2}}>
							<Form layout="inline">
								<Spin spinning={this.state.disabled}>
									<InputGroup placeholder="Enter your address to receive 50,000 Testnet NTY" enterButton="Give Me" size="large" disabled={this.state.disabled} onSearch={address=>this.givemeNTY(address)}>
									</InputGroup>
								</Spin>
								<Typography>Please be acknowledged that this <b>50,000 NTY</b> is on Nexty Testnet. Dont try to use it on exchanges <span  role="img" aria-label="monkey">🙈🙈🙈</span></Typography>
								<Recaptcha ref={ ref => this.recaptcha = ref } sitekey="6LeoiZUUAAAAAPJMgCInJpZ9Hzpt35KsJjk508UG" onResolved={ () => this.onResolved() } />
							</Form>
						</Col>
					</Row>
        </header>
      	</div>
    );
  }
}

export default App;
