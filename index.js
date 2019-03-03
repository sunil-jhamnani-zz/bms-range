(function () {

  let defaultRange = [7000,7001,7002,7003,7004,7005];
  let duplicates = [];
  let notificationTimeout;

  /*
    initializing event handlers and initial result value
   */
  function init() {
    $(document).on('keyup', '.input-control', onKeyPress());
    $(document).on('click', '.close-notification', closeNotification);
    $(document).ready(() => {
      $('.final-list').text(defaultRange.join());
    })
  }

  /*
    debounced onKeyPress function
   */
  function onKeyPress() {
    let timeout;

    return function () {
      let $this = $(this);

      if ($this.val() && !$this.val().match(/^[0-9,-]+$/)) {
        $this.val('');
        return;
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(showValues.bind(this), 500);
    }
  }

  /*
    function to display results and notifications if any
   */
  function showValues() {
    duplicates = [];
    let $this = $(this);
    let errorMessage;
    let allValues = $this.val().split(',');
    allValues.forEach(function (value) {
      if (value.match(/-/)) {
        errorMessage = rangeValidation(value);
        if (!errorMessage) {
          // found a range
          let rangeValues = value.split('-');
          let minVal = parseInt(rangeValues[0]);
          let maxVal = parseInt(rangeValues[1]);

          while(minVal <= maxVal) {
            addToList(minVal);
            minVal++;
          }
        } else {
          displayNotification('error', errorMessage)
        }
      } else {
        addToList(value)
      }
    });

    if (!errorMessage && duplicates.length) {
      displayNotification('info', duplicates.join() + (duplicates.length === 1 ? ' is a duplicate' : ' are duplicates') + ' and will be skipped');
    }
    $('.final-list').text(defaultRange.join());
    $this.val('');
  }

  /*
    Validate if the range entered is in the correct format
   */

  function rangeValidation(inputVal) {
    if (inputVal.indexOf('-', inputVal.indexOf('-') + 1) !== -1) {
      return "Incorrect range format";
    } else if (!inputVal.match(/^[0-9].*-.*[0-9]$/)) {
      return "Incorrect range format";
    } else {
      let rangeValues = inputVal.split('-');
      if (parseInt(rangeValues[0]) > parseInt(rangeValues[0])) {
        return "Incorrect range format";
      }
    }
  }

  /*
    Add value to the list and duplicates if any
   */
  function addToList(value) {
    value = parseInt(value);
    if (!value)
      return;
    if (defaultRange.indexOf(value) === -1) {
      defaultRange.push(value);
      defaultRange.sort((a,b) => (a - b));
    } else {
      if (duplicates.indexOf(value) === -1) {
        duplicates.push(value);
      }
    }
  }

  /*
    Display all type of notification. For now error and info are implemented
   */

  function displayNotification(type, message) {
    if (notificationTimeout) {
      $('.notification').removeClass('animate');
      clearTimeout(notificationTimeout);
    }
    let $container = $('.' + type + '-container');
    $container.find('.message-content').text(message);
    $container.addClass('animate');
    notificationTimeout = setTimeout(() => {
      $container.removeClass('animate');
    }, 3000)
  }

  /*
   Close notification if close clicked
   */
  function closeNotification() {
    $(this).closest('.notification').addClass('hide');
  }

  init();
}());