<div id="logout-block" class='clear-fix'>
    <div class='align-left'>
         <button class="logOut">Make a photo</button>
    </div>
    <div class='align-right'>
        <span>Signed in as <strong> <%= Parse.User.current().escape("username")%> </strong></span>
        <button class="logOut">LogOut</button>
    </div>
</div>