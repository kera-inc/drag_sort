drag_sort

=======

Features
--------

The simplest HTML5 Drag & Drop Library

Usage
-----

```
var DragSort = require('dragSort');

var watcher = DragSort.init(element, '.child_class', function(oldIndex, newIndex) {
  console.log(oldIndex);
  console.log(newIndex);
});


watcher.destroy();
```

Notes
-----
* Use need to specify sortable=true on the elements you want sortable
* Only works properly with horizontal sorting
