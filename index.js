let selects = document.querySelector(".pokemon-dropdown-select")
let pokemonProfile = document.querySelector('.profile-container')
let pokemonProfCard = pokemonProfile.querySelector('.profile-card')
let myPostsDiv = pokemonProfile.querySelector('.my-posts')
let followingPosts = document.querySelector('.following-posts-container')
let followingSelection = document.querySelector('.following-dropdown-select')
let followingDropdown = followingPosts.querySelector('.following-dropdown')
let chosenFollow = followingPosts.querySelector('.selected-posts-container')

// To toggle "Add Post" form on button click
let displayForm = false

// Makes dropdown of all pokemon at top of page
get("http://localhost:3000/pokemons")
.then(respJSON => {
    respJSON.forEach(opt => {
        let newOption = document.createElement('option')
        newOption.className = 'selected'
        newOption.value = opt[0]
        newOption.innerText = opt[1]
        selects.append(newOption)
    })
})

// Changes the profile being viewed based on which pokemon was selected from dropdown
get(`http://localhost:3000/pokemons/1`)
    .then(respJSON => {
        createProfile(respJSON)
        createFollowingDropdown(respJSON)
    })

selects.addEventListener('change', evt => {
    evt.preventDefault()
    let selected = evt.target.value
    get(`http://localhost:3000/pokemons/${selected}`)
    .then(respJSON => {
        removeChildren(pokemonProfCard)
        removeChildren(myPostsDiv)
        removeChildren(followingSelection)
        removeChildren(chosenFollow)

        createProfile(respJSON)
        createFollowingDropdown(respJSON)
    })
})

// Helper function used throughout to remove children
function removeChildren(parentNode) {  
    while (parentNode.firstChild) { 
      parentNode.removeChild(parentNode.firstChild)  
    }
  }

// Helper function to replace fetch and first .then, used for each fetch
function get(url){
return fetch(url)
.then(resp => resp.json())
}

// Major function to build the profile card, new post form, and profile posts 
function createProfile(obj){
    // Makes profile card
    let profileCard = document.createElement('div')
        profileCard.className = 'card pokemon-profile'
        profileCard.style.width = '22rem'

        let profileHeader = document.createElement('div')
            profileHeader.className = 'profile-header'

            let profileName = document.createElement('h3')
                profileName.innerText = `${obj.species}`
                profileName.className = 'pokemon-name'

            let countDiv = document.createElement('div')
                countDiv.className = 'count'

                let followerCount = document.createElement('h5')
                    followerCount.className = 'follower-count'
                    followerCount.innerText = obj.followers.length === 1 ? ' follower' : ' followers'

                    let countSpan = document.createElement('span')
                        countSpan.innerText = `${obj.followers.length}`
                    followerCount.prepend(countSpan)

                let followingCount = document.createElement('h5')
                    followingCount.className = 'following-count'
                    followingCount.innerText = ' following'

                    let followingCountSpan = document.createElement('span')
                        followingCountSpan.innerText = `${obj.follows.length}`
                    followingCount.prepend(followingCountSpan)

                countDiv.append(followerCount, followingCount)
            
            profileHeader.append(profileName, countDiv)
        
        let postsCount = document.createElement('h5')
            postsCount.className = 'posts-count'
            postsCount.innerText = obj.posts.length === 1 ? ' post' : ' posts'

            let postSpan = document.createElement('span')
                postSpan.className = 'post-count-span'
                postSpan.innerText = obj.posts.length

            postsCount.prepend(postSpan)

        let profilePic = document.createElement('img')
            profilePic.className = 'card-img-top'
            profilePic.src = `${obj.image}`
            profilePic.alt = `${obj.species}-pic`

    // Makes new post form 
        let formContainer = document.createElement('div')
            formContainer.className = 'form-container'

            let createPostForm = document.createElement('form')
                createPostForm.className = 'create-post-form'

                let formHeader = document.createElement('label')
                    formHeader.className = 'form-title'

                    let strong = document.createElement('strong')
                        strong.innerText = 'New Post'

                    formHeader.append(strong)

                let formDiv = document.createElement('div')
                    formDiv.className = 'form-row'

                    let captionDiv = document.createElement('div')
                        captionDiv.className = 'col'

                        let captionInput = document.createElement('input')
                            captionInput.name = 'caption'
                            captionInput.type = 'text'
                            captionInput.value = ""
                            captionInput.placeholder = "Caption..."
                            captionInput.className = "input-text form-control"
                        
                        captionDiv.append(captionInput)

                    let imageDiv = document.createElement('div')
                        imageDiv.className = 'col'
                    
                        let imageInput = document.createElement('input')
                            imageInput.name = 'image'
                            imageInput.type = 'text'
                            imageInput.value = ""
                            imageInput.placeholder = "Image URL..."
                            imageInput.className = 'input-text form-control'

                        imageDiv.append(imageInput)

                    let submitDiv = document.createElement('div')
                        submitDiv.className = 'col'

                        let submitForm = document.createElement('button')
                            submitForm.type = 'submit'
                            submitForm.name = 'submit'
                            submitForm.innerText = 'Submit Post'
                            submitForm.className = 'submit btn btn-primary'

                        submitDiv.append(submitForm)

            createPostForm.append(formHeader, captionDiv, imageDiv, submitDiv)
            createPostForm.addEventListener('submit', evt => {
                evt.preventDefault()
                submitNewPost(evt, obj)
            })

        formContainer.append(createPostForm)
    
    // Creates button to toggle form visible or not

        let toggleForm = document.createElement('button')
            toggleForm.id = 'toggle-form'
            toggleForm.className = 'btn btn-primary'
            toggleForm.style = 'text-align: center; background-color: #2F4FA5;'
            toggleForm.innerText = '+ Post'
            toggleForm.addEventListener('click', evt => {
                formDisplay(toggleForm)
            })

    // 
        let profilePostsContainer = document.createElement('div')
            profilePostsContainer.className = 'pokemon-posts-container'

    // Creates each post using makePostCard and adds deletes functionality (as only one's own posts can be deleted)
        obj.posts.forEach(post => {
            let postCard = makePostCard(post, obj)

                let deleteBtn = document.createElement('button')
                    deleteBtn.className = 'delete-post btn'
                    deleteBtn.innerText = 'Delete Post'
                    deleteBtn.addEventListener('click', evt => {  
                        postCard.remove()
                        deletePost(post)
                    })
            
            postCard.append(deleteBtn)
            myPostsDiv.append(postCard)
        })

    // Appends everything to DOM
    profileCard.append(profileHeader, postsCount, profilePic, formContainer, toggleForm, profilePostsContainer)
    pokemonProfCard.prepend(profileCard)
}

// Delete button exists only for the selected pokemon's own posts and not others
function deletePost(post){
    fetch(`http://localhost:3000/posts/${post.id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(respJSON => {
        let postCount = document.querySelector('.post-count-span')
        postCount.innerText = parseInt(postCount.innerText) - 1
    })
}

// Function to create post when submitting new post form 
function submitNewPost(evt, obj){
    let newCaption = evt.target.caption.value
    let newImage = evt.target.image.value
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            image: newImage,
            caption: newCaption,
            pokemon_id: obj.id
        })
    })
    .then(resp => resp.json())
    .then(respJSON => {
        if (respJSON.errors) {
           return alert(respJSON.errors[0])
        }
        let postCount = document.querySelector('.post-count-span')
        let newPost = makePostCard(respJSON, obj)
        let deleteBtn = document.createElement('button')
            deleteBtn.className = 'delete-post btn'
            deleteBtn.innerText = 'Delete Post'
            deleteBtn.addEventListener('click', evt => {
                let postToDelete = evt.target.parentElement
                deletePost(respJSON)
                postToDelete.remove()
            })
        newPost.append(deleteBtn)
        myPostsDiv.prepend(newPost)

        postCount.innerText = parseInt(postCount.innerText) + 1
    })
}

// New post form show/hide controls
function formDisplay(toggleForm){
    displayForm = !displayForm

    let formContainer = document.querySelector('.form-container')
    let toggleBtn = document.querySelector('#toggle-form')

    if (displayForm){
        formContainer.style.display = 'block'
        toggleBtn.style["background-color"] = '#9A2D2D'
        toggleBtn.style["border-color"] = '#5A0909'
        toggleBtn.innerText = '- Post'

    } else {
        formContainer.style.display = 'none'
        toggleBtn.style["background-color"] = '#2F4FA5'
        toggleBtn.style["border-color"] = '#11095A'
        toggleBtn.innerText = '+ Post'
    }
}

// Creates second dropdown of pokemon based on who the main pokemon being viewed follows
function createFollowingDropdown(obj){
        let i = 0
        followingSelection.innerHTML = `<option value="" disabled selected>Select a Pokemon to View</option>`
        obj.follows.forEach(following => {
            let followingOption = document.createElement('option')
                followingOption.className = 'selected'
                followingOption.value = i
                followingOption.innerText = following.species
            followingSelection.append(followingOption)
            i += 1
        })

        createPosts(obj.follows[0])
        makeFollowingProfile(obj.follows[0])
        followingSelection.addEventListener('change', evt => {
            let x = evt.target.value
            createPosts(obj.follows[x])
            makeFollowingProfile(obj.follows[x])
        })
}

//Creates a profile for a selected Following to display
function makeFollowingProfile(obj){
    let profileCard = document.createElement('div')
        profileCard.className = 'card following-profile'
        profileCard.style.width = '15rem'

        let profileHeader = document.createElement('div')
            profileHeader.className = 'profile-header'

            let profileName = document.createElement('h3')
                profileName.innerText = `${obj.species}`
                profileName.className = 'pokemon-name'
            
            profileHeader.append(profileName)
        
        let postsCount = document.createElement('h5')
            postsCount.className = 'posts-count'
            postsCount.innerText = obj.posts.length === 1 ? ' post' : ' posts'
            postsCount.style.background = 'grey'

            let postSpan = document.createElement('span')
                postSpan.className = 'post-count-span'
                postSpan.innerText = obj.posts.length

            postsCount.prepend(postSpan)

        let profilePic = document.createElement('img')
            profilePic.className = 'card-img-top'
            profilePic.src = `${obj.image}`
            profilePic.alt = `${obj.species}-pic`
        
    profileCard.append(profileHeader, postsCount, profilePic)
    chosenFollow.prepend(profileCard)
}

// Loads posts for the pokemon selected in the Following Dropdown
function createPosts(obj){
    removeChildren(chosenFollow)
    obj.posts.forEach(function(post){
        let postCard = makePostCard(post, obj)
        chosenFollow.append(postCard)
    })
}

// Helper function to create each post, used both for pokemon profile and viewing following's posts
function makePostCard(postObj, parentObj) {

    // Parent element, the post-card
    let postCard = document.createElement('div')
        postCard.className = "card post-card"
        postCard.style.width = '20rem'

        // First inner div
        let proPicDiv = document.createElement('div')
            proPicDiv.className = "profile-link"

            let propic = document.createElement("img") 
                propic.src = parentObj.image
                propic.alt = "Profile Thumbnail" 
                propic.height  = 25 
                propic.width = 25 

            let profileN = document.createElement('span')
                profileN.className = 'profile-icon-name'
                profileN.innerText = parentObj.species

        proPicDiv.append(propic, profileN) 
        
        // Second inner div
        let mainImageDiv = document.createElement('div')
            mainImageDiv.className = "post-image"

            let pic = document.createElement("img") 
                pic.className = 'card-img-top'
                pic.src = postObj.image 
                pic.alt = "Image File" 

        mainImageDiv.appendChild(pic) 

        // Third innner div
        let captionDiv = document.createElement("div")
            captionDiv.className = "post-caption card-body"

            let caption = document.createElement("p")
                caption.className = 'card-text'
                caption.innerText = postObj.caption 

        captionDiv.appendChild(caption)
        
        // Fourth inner div 
        let likesDiv = document.createElement('div')
            likesDiv.className = "post-likes d-flex justify-content-center" 

            let likeBtn = document.createElement("button") 
                likeBtn.className = 'btn btn-primary like-btn'
                likeBtn.innerText = " likes"
                
                    let likes_count = document.createElement('span')
                        likes_count.innerText = postObj.likes_count 
                        likeBtn.prepend(likes_count)

                likeBtn.addEventListener('click', evt => {
                    likes_count.innerText = parseInt(likes_count.innerText) +  1
                    addLike(postObj)
                })
    
    // Append all to main post-card div 
        likesDiv.append(likeBtn)  

    postCard.append(proPicDiv, mainImageDiv, captionDiv, likesDiv)

    return postCard
}

//Function to like any post, no limit for multiple likes or liking own posts 
function addLike(obj){
    let pokemon_id = obj.pokemon_id
    let post_id = obj.id
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            post_id: post_id,
            pokemon_id: pokemon_id
        })
    })
}