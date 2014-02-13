# Periodically check if the 'fail to join' DOM element appears
restart = ->
  timer = setTimeout ->
    target = document.querySelector(".d-Fa-uc-A.BF")
    return restart()  unless target
    
    # inject a 'join' button DOM element aftr the failed to join message
    switchButton = "<div role=\"button\" id=\"switch-user\" class=\"c-N-K a-b a-b-ga d-Dc-b DF a-b-U-Z\" tabindex=\"0\" style=\"-webkit-user-select: none;margin-top:20px !important\">Switch User?</div>"
    target.insertAdjacentHTML "beforeend", switchButton
    
    # When the user clicks on the button, change ?authuser=1 (google multi-sign-in order starting from 0)
    document.getElementById("switch-user").addEventListener "click", ->
      found = window.location.search.indexOf("authuser=")
      if ~found and window.location.search[found + 9] is "1"
        window.location.search = "authuser=0"
      else
        window.location.search = "authuser=1"

  , 1000