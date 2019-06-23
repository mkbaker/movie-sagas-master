import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import axios from "axios";
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
//'put' is how redux sagas dispatch actions
import {takeEvery, put} from 'redux-saga/effects';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('GET_MOVIES', getMovies);
    yield takeEvery('GET_MOVIE_GENRES', getMovieGenres);
    yield takeEvery('UPDATE_DESCRIPTION', updateDescription);
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

//Used to get movie info from server/database
function* getMovies(action) {
    try {
        const movieResponse = yield axios.get('/movies');
        yield put({type: 'SET_MOVIES', payload: movieResponse.data});
    } catch (error) {
        console.log('error getting movies', error);
    }
}

function* getMovieGenres(action) {
    try {
        // console.log(action.payload.id);
        const response = yield axios.get('/genres');
        yield put({type: 'SET_TAGS', payload: response.data});
    } catch (error) {
        console.log('error getting movie genres', error);
    }
}

//sends axios request to update description of lastClicked
function* updateDescription(action) {
    try { 
        const updateResponse= yield axios.put('/movies', action);
        yield put({type: 'SET_LAST_CLICKED', payload: updateResponse.data})
        yield put({type: 'GET_MOVIES'}); 
    } catch(error) {
        console.log('error with updateDescription', error);
    }
}




// Used to store movies returned from the server
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.payload;
        default:
            return state;
    }
}

// Used to store the movie genres
const genres = (state = [], action) => {
    switch (action.type) {
        case 'SET_TAGS':
            return action.payload;
        default:
            return state;
    }
}

//Used to store the last clicked movie to display at '/detail'
const lastClicked = (state = {}, action) => {
    switch (action.type) {
        case 'SET_LAST_CLICKED':
            return action.payload;
        default: 
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        lastClicked,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
registerServiceWorker();
