<div class="clear-fix">
    <div class="align-left">
        <label><input class="status-toggle" type="checkbox" <%= isComplete ? 'checked="checked"' : ''%>>
        <span><%= title %></span></label>
    </div>
    <div class="align-right">
        <button class="edit"><b>&#9997;</b></button>
        <button class="delete">&#10008;</button>
    </div>
</div>