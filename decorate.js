var menu = '<li class="github-omnibox-sidebar-item tooltipped leftwards" title="Travis CI"> \
        <a href="https://travis-ci.org/{owner}/{repo}" class="sunken-menu-item"> \
            <span class="octicon"><img src="https://travis-ci.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://secure.travis-ci.org/{owner}/{repo}.png" alt="Travis CI"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Gemnasium"> \
        <a href="https://gemnasium.com/{owner}/{repo}" class="sunken-menu-item"> \
            <span class="octicon"><img src="https://assets.gemnasium.com/assets/favicon.png"></span> \
            <span class="full-word"><img src="https://gemnasium.com/{owner}/{repo}.png" alt="Gemnasium"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="David DM"> \
        <a href="https://david-dm.org/{owner}/{repo}" class="sunken-menu-item"> \
            <span class="octicon"><img src="https://david-dm.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://david-dm.org/{owner}/{repo}.png" alt="David DM"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="David DM Dev"> \
        <a href="https://david-dm.org/{owner}/{repo}#info=devDependencies" class="sunken-menu-item"> \
            <span class="octicon"><img src="https://david-dm.org/favicon.ico"></span> \
            <span class="full-word"><img src="https://david-dm.org/{owner}/{repo}/dev-status.png" alt="David DM Dev"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Coveralls"> \
        <a href="https://coveralls.io/r/{owner}/{repo}" class="sunken-menu-item"> \
            <span class="octicon"><img src="https://coveralls.io/favicon.ico"></span> \
            <span class="full-word"><img src="https://coveralls.io/repos/{owner}/{repo}/badge.png" alt="Coveralls"></span> \
        </a> \
    </li> \
    <li class="github-omnibox-sidebar-item tooltipped leftwards" title="Code Climate"> \
        <a href="https://codeclimate.com/github/{owner}/{repo}" class="sunken-menu-item"> \
            <span class="octicon"><img src="https://codeclimate.com/favicon.ico"></span> \
            <span class="full-word"><img src="https://codeclimate.com/github/{owner}/{repo}.png" alt="Code Climate"></span> \
        </a> \
    </li>';

// The navigation sidebar
var target = document.querySelector('.sunken-menu-contents');
// Contains a 'public' or 'private' class for the repo
var isPublic = document.querySelector('.entry-title');

var tokens = document.querySelector('.js-repo-home-link').href.split('/').slice(-2);

if (target && isPublic && isPublic.classList.contains('public')) {

    menu = menu.replace(/\{owner\}/g, tokens[0]).replace(/\{repo\}/g, tokens[1]);

    var element = document.createElement('div');
    element.className = 'sunken-menu-separator';
    target.appendChild(element);
    element = document.createElement('ul');
    element.className = 'sunken-menu-group omnibox-menu';
    element.innerHTML = menu;

    [].forEach.call(element.querySelectorAll('img'), function(el){
        el.addEventListener('error', function(event){
            // event.srcElement.outerHTML = event.srcElement.alt;
            //    <img>      <span>        <a>           <li>
            event.srcElement.parentElement.parentElement.parentElement.outerHTML = '';
        });
    });

    target.appendChild(element);

}

// Is there a gh-pages branch but no project URL?
if (!document.querySelector('.repository-website') && document.querySelector('[data-name="gh-pages"]')) {
    target = document.querySelector('.repository-description');
    if (target) {
        element = document.createElement('div');
        if (!tokens[1]) tokens[1] = '';
        var url =  'http://'+tokens[0]+'.github.io/'+tokens[1];
        element.className = 'repository-website js-details-show';
        element.innerHTML = '<p><a href="'+url+'" rel="nofollow">'+url+'</a></p>';
        target.insertBefore(element);
    }
}