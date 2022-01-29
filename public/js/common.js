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
}