import React, {Component} from "react";
import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";
import { v4 as uuidv4 } from 'uuid';


class JokeList extends Component {
	static defaultProps={
		numJokes: 10
	}
	constructor(props){
		super(props);
		this.state={
			jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
			loading:false
		}
		this.handleClick= this.handleClick.bind(this)
	}
	
	handleVotes(id, delta){
		this.setState(
      	st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        )
      }),
		() => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
		)
	}
	componentDidMount(){
		if(this.state.jokes.length === 0){
			this.getJokes()
		}
		
	}
	
	handleClick(){
		this.setState({loading:true}, this.getJokes )
	}

	async getJokes(){
		let jokes=[];
		while(jokes.length < this.props.numJokes){
			let res = await axios.get("https://icanhazdadjoke.com/",{
			headers: {Accept: "application/json"}
			})
			let joke= {joke:res.data.joke, votes:0, id:uuidv4()};
			jokes.push(joke)
		}
		this.setState(
      	st => ({
			loading: false,
        	jokes: [...st.jokes, ...jokes]
      }),
		() => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
		)
		window.localStorage.setItem(
		"jokes",
			JSON.stringify(jokes)
		)
	}
	
	render(){
		if(this.state.loading){
			return(
				<div className="JokeList-spinner">
				  <i className="far fa-8x fa-laugh fa-spin"></i>
					<h1 className="JokeList-title">Loading...</h1>
				</div>
			)
		}
		return(
			<div className="JokeList">
				<div className="JokeList-sidebar">
					<h1 className="JokeList-title"><span>Dad</span> Jokes!</h1>
					<img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' 								 alt="dad jokes" />
					<button onClick={this.handleClick} className="JokeList-getmore">New Jokes</button>
				</div>
				
				<div className="JokeList-jokes">
					{this.state.jokes.map( j=>  (
					<Joke 
						text={j.joke} 
						votes={j.votes} 
						key={j.id} 
						upVote={()=> this.handleVotes(j.id, 1)} 
						downVote={()=> this.handleVotes(j.id, -1)}
					/>  
					))}
				</div>
			</div>
		)
	}
}

export default JokeList;