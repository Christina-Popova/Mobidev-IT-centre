<div id="logout-block">
    <span>Signed in as <strong> <%= Parse.User.current().escape("username")%> </strong></span>
    <button class="logOut">LogOut</button>
</div>