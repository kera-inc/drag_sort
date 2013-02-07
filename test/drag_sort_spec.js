describe('DragSort', function() {
  var $ = require('component-jquery');
  var expect = chai.expect;

  var dragSort = require('drag_sort');
  var list, originalEvent;

  beforeEach(function() {
    var html = '<ul id="list" style="position: absolute; left: 0; top: 0; width: 120px; list-style-type: 0; padding: 0; margin: 0">' +
      '<li class="list_item" style="float:left; width: 30px; height: 30px; list-style-type: none; padding: 0; margin: 0;">Item 2</li>' +
      '<li class="list_item" style="float:left; width: 30px; height: 30px; list-style-type: none; padding: 0; margin: 0;">Item 1</li>' +
      '<li class="list_item" style="float:left; width: 30px; height: 30px; list-style-type: none; padding: 0; margin: 0;">Item 3</li>' +
      '<li class="list_item" style="float:left; width: 30px; height: 30px; list-style-type: none; padding: 0; margin: 0;">Item 4</li>' +
    '</ul>';

    $(document.body).append(html);
    list = $('#list');
  });

  afterEach(function() {
    list.remove();
  });

  function dragStart(element) {
    var e = $.Event('dragstart');
    e.originalEvent = { dataTransfer: {} };
    element.trigger(e);
  }

  function dragOver(target, clientX) {
    var e = $.Event('dragover');
    e.originalEvent = { preventDefault: sinon.spy(), clientX: clientX };
    target.trigger(e);
  }

  function dragEnd(element) {
    element.trigger('dragend');
  }

  describe('when the last item is draggedStarted', function() {
    var dragSpy, dragSource, watcher;

    beforeEach(function() {
      dragSpy = sinon.spy();
      watcher = dragSort.init(list, '.list_item', dragSpy);

      dragSource = $('.list_item:eq(3)');
      dragStart(dragSource);
    });

    it('adds the "dragging" class to the dragSource', function() {
      expect(dragSource.hasClass('dragging')).to.equal(true);
    });

    describe('when destroying the dragSort', function() {
      beforeEach(function() {
        watcher.destroy();

        var dragTarget = $('.list_item:eq(0)');
        dragOver(dragTarget, 0);
        dragEnd(dragSource);
      });

      it('does not respond to drag events anymore', function() {
        expect(dragSpy.called).to.equal(false);
      });

    });

    describe('when it is dragged to the left of the first item', function() {
      var dragTarget;

      beforeEach(function() {
        dragTarget = $('.list_item:eq(0)');
        dragOver(dragTarget, 0);
      });

      it('puts the dragSource in the first position', function() {
        expect(dragSource.index()).to.equal(0);
      });

      it('pushes the dragTarget over one', function() {
        expect(dragTarget.index()).to.equal(1);
      });

      describe('when dragging ends', function() {
        beforeEach(function() {
          dragEnd(dragSource);
        });

        it('removes dragging class', function() {
          expect(dragSource.hasClass('dragging')).to.equal(false);
        });

        it('executes the callback passing the oldIndex and newIndex', function() {
          expect(dragSpy.calledWith(3, 0)).to.equal(true);
        });
      });
    });

    describe('when it is dragged to the right of the first item', function() {
      var dragTarget;

      beforeEach(function() {
        dragTarget = $('.list_item:eq(0)');
        dragOver(dragTarget, 20);
      });

      it('puts the dragSource to the right of the first item', function() {
        expect(dragSource.index()).to.equal(1);
      });
    });

    describe('when it is dragged over itself', function() {
      var dragTarget;

      beforeEach(function() {
        dragTarget = dragSource;
        dragOver(dragTarget, 130);
      });

      it('keeps the same index', function() {
        expect(dragSource.index()).to.equal(3);
      });
    });
  });
});
