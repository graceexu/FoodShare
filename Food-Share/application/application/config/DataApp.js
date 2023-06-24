import ConfigApp from "./ConfigApp";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIMIT_ITEMS = 10;
const RECENT_LIMIT = 10;
const FEATURED_LIMIT = 10;

////////////////////////////////// API

export async function getFeaturedRecipes(){
  try {
    const url = `${ConfigApp.URL}YOUR_URLlimit=${FEATURED_LIMIT}&order=desc`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getLatestRecipes(page){
  try {
    const url = `${ConfigApp.URL}YOUR_URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getRecipeById(id){
  try {
    const url = `${ConfigApp.URL}YOUR_URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getRecipesByCategory(id, page){
  try {
    const url = `${ConfigApp.URL}YOUR_URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getRecipesByAuthor(id, page){
  try {
    const url = `${ConfigApp.URL}YOUR_URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getFeaturedCategories(){
  try {
    const url = `${ConfigApp.URL}YOUR_URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function searchApi(query, page){

  const url = `${ConfigApp.URL}YOUR_URL}`;

  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function getMembers(page){

  const url = `${ConfigApp.URL}YOUR_URL}`;
  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}


export async function getFavorites(id, page){
  try {
    const url = `${ConfigApp.URL}YOUR_URL}`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getFeed(id, page){
  try {
    const url = `${ConfigApp.URL}YOUR_URL}`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getComments(item, page){
  try {
    const url = `${ConfigApp.URL}URL}`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getReplies(id, page){
  try {
    const url = `${ConfigApp.URL}URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getMemberById(id){
  try {
    const url = `${ConfigApp.URL}URL`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export async function getStrings(){

  const url = `${ConfigApp.URL}URL`;
  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    
  }
}

////////////////////////////////// Like & Follow System

export const submitComment = async (id, user, action, body, comment) => {

  const url = `${ConfigApp.URL}URL`;
    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                action: action,
                comment_item: id,
                comment_user: user,
                comment_text: body,
                comment_id: comment

            })
        })
        const json = await resp.json();
        return json;
    
    }catch (e) {

          // console.log('Error...', e.message);

      }
}

export async function checkLike(user, item){
  try {
    const url = `${ConfigApp.URL}URL}`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export const submitLike = async (user, item) => {

  const url = `${ConfigApp.URL}URL`;
    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                action: 'like',
                user_id: user,
                item_id: item

            })
        })
        const json = await resp.json();
        return json;
    
    }catch (e) {

          // console.log('Error...', e.message);

      }
}

export const submitUnLike = async (user, item) => {

  const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                action: 'unlike',
                user_id: user,
                item_id: item

            })
        })
        const json = await resp.json();
        return json;
    
    }catch (e) {

          // console.log('Error...', e.message);

      }
}

export async function checkFollow(user, follower){

  try {
    const url = `${ConfigApp.URL}URL{FOLLOWER}`;
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
  }
}

export const submitFollow = async (user, follower) => {

  const url = `${ConfigApp.URL}URL`;
    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                action: 'follow',
                user_id: user,
                follower_id: follower

            })
        })
        const json = await resp.json();
        return json;
    
    }catch (e) {

          // console.log('Error...', e.message);

      }
}

export const submitUnFollow = async (user, follower) => {

  const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                action: 'unfollow',
                user_id: user,
                follower_id: follower

            })
        })
        const json = await resp.json();
        return json;
    
    }catch (e) {

          // console.log('Error...', e.message);

      }
}

////////////////////////////////// Authentication


export const checkUserApi = async (email) => {

	const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                user_email: email,

            })
        })
        const json = await resp.json();
        return json;
		
		}catch (e) {

          // console.log('Error...', e.message);

      }
}

export const restPassApi = async (email) => {

	const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                user_email: email,

            })
        })
        
        const json = await resp.json();

        return json;
		
		}catch (e) {

          // console.log('Error...', e.message);

      }
}

export const signInApi = async (email, password) => {

	const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                user_email: email,
                user_password: password

            })
        })
        const json = await resp.json();

        return json;
		
		}catch (e) {

          // console.log('Error...', e.message);

      }
}

export const contactForm = async (name, email, message) => {

  const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: name,
                user_email: email,
                user_message: message
            })
        })
        const json = await resp.json();
        return json;
    
    }catch (e) {

          // console.log('Error...', e.message);

      }
}

export const signUpApi = async (name, email, password) => {

	const url = `${ConfigApp.URL}URL`;

    try {

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                user_name: name,
                user_email: email,
                user_password: password

            })
        })
        const json = await resp.json();
        

        return json;
		
		}catch (e) {

          // console.log('Error...', e.message);

      }
}

export const signOutApi = async () => {

	try {
		await AsyncStorage.removeItem("isLogged");
		await AsyncStorage.removeItem("userData");
	} catch (error) {
		//console.log("Error", error);
	}

}

export const getLogged = async () => {
	try {
		const isLogged = await AsyncStorage.getItem("isLogged");
		return isLogged;
	} catch (error) {
		//console.log("Error", error);

	}
}

export const setLogged = async (value) => {
	try {
		await AsyncStorage.setItem("isLogged", `${value}`);
	} catch (error) {
		//console.log("Error", error);
	}

}

export const setUserData = async (user) => {

	try {
		await AsyncStorage.setItem("userData", JSON.stringify(user));
	} catch (error) {
		//console.log("Error", error);
	}

}

export const getUserData = async () => {

	try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      return data;
	} catch (error) {
		//console.log("Error", error);
	}
}


