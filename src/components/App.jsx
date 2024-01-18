import React, { Component } from 'react';
import Notiflix from 'notiflix';
import Button from './Button';
import ImageGallery from './ImageGallery';
import { fetchImages } from './feachImage/FeachImage';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader';

let page = 1;

class App extends Component {
  state = {
    inputData: '',
    items: [],
    status: 'idle',
    totalHits: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputData !== prevState.inputData) {
      this.handleSubmit(this.state.inputData);
    }
  }

  handleSubmit = async (inputData) => {
    page = 1;
    if (inputData.trim() === '') {
      Notiflix.Notify.info('You cannot search by an empty field, try again.');
      return;
    } else {
      try {
        this.setState({ status: 'pending' });
        const { totalHits, hits } = await fetchImages(inputData, page);
        if (hits.length < 1) {
          this.setState({ status: 'idle' });
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          this.setState({
            items: hits,
            inputData,
            totalHits: totalHits,
            status: 'resolved',
          });
        }
      } catch (error) {
        this.setState({ status: 'rejected' });
      }
    }
  };

  onNextPage = async () => {
    this.setState({ status: 'pending' });

    try {
      const { hits } = await fetchImages(this.state.inputData, (page += 1));
      this.setState((prevState) => ({
        items: [...prevState.items, ...hits],
        status: 'resolved',
      }));
    } catch (error) {
      this.setState({ status: 'rejected' });
    }
  };

  render() {
    const { totalHits, status, items } = this.state;
    if (status === 'idle') {
      return (
        <div>
          <Searchbar onSubmit={this.handleSubmit} />
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div>
          <Searchbar onSubmit={this.handleSubmit} />
          <ImageGallery page={page} items={this.state.items} />
          <Loader />
          {totalHits > 12 && <Button onClick={this.onNextPage} />}
        </div>
      );
    }
    if (status === 'rejected') {
      return (
        <div>
          <Searchbar onSubmit={this.handleSubmit} />
          <p>Something wrong, try later</p>
        </div>
      );
    }
    if (status === 'resolved') {
      return (
        <div>
          <Searchbar onSubmit={this.handleSubmit} />
          <ImageGallery page={page} items={this.state.items} />
          {totalHits > 12 && totalHits > items.length && (
            <Button onClick={this.onNextPage} />
          )}
        </div>
      );
    }
  }
}

export default App;