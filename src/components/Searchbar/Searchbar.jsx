import React, { Component } from 'react'
import Notiflix from 'notiflix';

import css from  './Searchbar.module.css'

 class Searchbar extends Component {
  state = {
    inputvalue: ''
  }
  hendleSubmit = (e)=>{
    e.preventDefault () 
    if( this.state.inputvalue.trim()=== ''){
       Notiflix.Notify.failure('please writing value ');
    }
  
    this.props.onSubmit(this.state.inputvalue)
    this.setState({
      inputvalue: ''
    })
  }

  hendleChange = (e) =>{
    this.setState({
      inputvalue: e.currentTarget.value.toLowerCase()
    })
  }
  render() {
  
    return (
        <header className={css.searchbar}>
        <form  onSubmit={ this.hendleSubmit}   className={css.form}>
          <input  
          onChange={this.hendleChange}
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
            <button type="submit" className={css.button}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Search_Icon.svg/1200px-Search_Icon.svg.png" width="30px" height="30px" alt=""/>
          </button>
        </form>
      </header>
    )
  }
}

export default Searchbar