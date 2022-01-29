async function signup(){
    // Get form info
    const username = document.querySelector(".usernameInput").value
    const password = document.querySelector(".passwordInput").value
    // Create the fetch request to the api
    const signupFetch = await fetch("/api/v1/users/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    const signupResult = await signupFetch.json();
    if (signupResult.error == true){
        console.log(signupResult);
        document.querySelector(".alertbox").style.display = "";
        document.querySelector(".signupError").innerHTML = `Signup Error: ${signupResult.errorLog}`;
    } else {
        // Set storage items
        localStorage.setItem("authToken", signupResult.user.authToken);
        // redirect
        window.location.href = "/settings"    
    }
}

async function login(){
    const username = document.querySelector(".usernameInput").value
    const password = document.querySelector(".passwordInput").value
    // Create the fetch request to the api
    const loginFetch = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    const loginResult = await loginFetch.json();
    if (loginResult.error == true){
        console.log(loginResult);
        document.querySelector(".alertbox").style.display = "";
        document.querySelector(".loginError").innerHTML = `Login Error: ${loginResult.errorLog}`;
    } else {
        // Set storage items
        localStorage.setItem("authToken", loginResult.authToken);
        // redirect
        window.location.href = "/settings"    
    }
}
async function checkAuth(){
    const checkFetch = await fetch("/api/v1/users/verifytoken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            authToken: localStorage.getItem("authToken")
        })
    });
    const checkStatus = await checkFetch.json();
    if (!checkStatus.valid){
        alert("Please signin to access this page!")
        window.location.href = "/";
    }
}
async function getUsername(){
    // Check if we cached the username, if so return it
    if (sessionStorage.getItem("cachedUsername") != null){
        return sessionStorage.getItem("cachedUsername");
    }
    // If not make a HTTP request
    // Make fetch request
    const userInfoFetch = await fetch("/api/v1/users/tokenowner", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            authToken: localStorage.getItem("authToken")
        })
    });
    const userFetch = await userInfoFetch.json();
    if (userFetch.error){
        console.log(userFetch);
        console.error("Failed to retrive user info!");
        alert("The auth token has expired or is invalid!");
        window.location.href = "/";
    } else {
        // Cache the username in memory
        sessionStorage.setItem("cachedUsername", userFetch.owner);
        return userFetch.owner;
    }
}
async function getUserInfo(){
    const username = await getUsername();
    const userInfoFetch = await fetch(`/api/v1/users/info/${username}`, {
        method: "GET"
    });
    const userInfo = await userInfoFetch.json();
    return userInfo.user;
}
async function loadUserInfo(){
    const userInfo = await getUserInfo();
    console.log(userInfo);
    // Update stuff
    document.querySelector(".onlineCheckbox").checked = userInfo.online;

}
async function updateProfile(){
    
}
