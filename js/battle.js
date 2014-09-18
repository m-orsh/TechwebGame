  /* grab the JSON for battle processing*/
  var battle = (function(json) {

    function init () {
      console.log("Reading JSON");

      var json = $.getJSON( "testbattle.json", function() {
          console.log( "success" );

        })
          .done(function() {
            console.log( "second success" );
          })
          .fail(function() {
            console.log( "error" );
          })
          .always(function() {
            console.log( "complete" );
          });
      var obj = $.parseJSON(json);
      battleProc(obj);
    }



    function battleProc (jsonArray) {
       
       startAnimation();
       var iter = 0;
       var result = jsonArray.results.results;
       while(iter<result.length){
          battleAnimation(result.attacker, result.hit, result.health, result.message); 
       }
       endAnimation();
    }
    
    function battleAnimation(attacker,hit,health,message){
      if(attacker=='challenger')){
          $("#challenger_img").animate({
            opacity: 0.25,
            left: "+=50",
            height: "toggle"
          }, 5000, function() {
            // Animation complete.
          });
      }
      else if(attacker=='defender'){
          $("#defender_img").animate({
            opacity: 0.25,
            left: "+=50",
            height: "toggle"
          }, 5000, function() {
            // Animation complete.
          });
      }

    }


    // This is where we have all our controllers to handle events
    function bindUIActions() {
      //Projects Dropdown
      $(projectDropdown).on('change', function(evt, params) {
        console.log($(projectDropdown + ' option:selected').text());
        uiModel.currentProject = $(projectDropdown + ' option:selected').text();
        todoCollection.grabTodos(projectModel.getIdFromName(uiModel.currentProject).id);
        //Should cause a change in todoCollection
      });

      //Add project
      $(addProject).click(function() {
        $.ajax({
          url: "/widgets/pomo_task_manager/addProject.html",
          dataType: "html",
          success: function(data) {
            $(project).html(data);
            elementsControl.showThisSelector("project");
            bindAddProjectActions();
          }
        });
      });

      $(submitAddProject).click(function() {
          var projectName = $(inputProjectName).val();
          var projectDesc = $(inputProjectDesc).val();

          var request = gapi.client.request({
            'path': 'calendar/v3/calendars',
            'method': 'POST',
            'body': {
              'summary': "Project: " + projectName,
              'description': projectDesc
            }
          });

          var btn = $(this);
          btn.button('loading');
          request.execute(function(resp) {
            btn.button('reset');
            var name = $(inputProjectName).val()
            uiModel.currentProject = name;
            model.addCalendar(name, resp.id);
            todoCollection.grabTodos(projectModel.getIdFromName(uiModel.currentProject).id);
            elementsControl.showThisSelector("main");
          });


      });
      
    }

    function submitResults () {
      
    }


  });