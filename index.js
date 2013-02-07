var dragSource;
var oldIndex;
var newIndex;
var $ = require('jquery');

var DragSort = {
  init: function(element, childClass, callback) {
    $(element).on('dragstart.dragSort', childClass, function(e) {
      dragSource = this;

      var dataTransfer = e.originalEvent.dataTransfer;
      dataTransfer.effectAllowed = 'move';

      $(dragSource).css({ opacity: 0.4 });
      oldIndex = $(dragSource).index();
    });

    $(element).on('dragend.dragSort', childClass, function(e) {
      newIndex = $(dragSource).index();
      $(dragSource).css({ opacity: 1 });

      if (oldIndex == newIndex) {
        return;
      }

      callback(oldIndex, newIndex);
    });

    $(element).on('dragover.dragSort', childClass, function(e) {
      e.originalEvent.preventDefault();

      if (this == dragSource) {
        return;
      }

      var middleOfElement = $(this).offset().left + ($(this).outerWidth() / 2);
      var clientX = e.originalEvent.clientX;

      if (clientX < middleOfElement) {
        if ($(this).prev()[0] != dragSource) {
          $(this).before(dragSource);
        }
      } else {

        if ($(this).next()[0] != dragSource) {
          $(this).after(dragSource);
        }
      }
    });

    return {
      destroy: function() {
        $(element).off('.dragSort');
      }
    }
  }
}

module.export = DragSort;
