/**
 * @author: Halley Yan
 * @version: v1.0.0
 * @description: bootstrap-table 多级表头 fixed https://github.com/wenzhixin/bootstrap-table/issues/3054
 */
~(function() {
  'use strict';
  var BootstrapTable = $.fn.bootstrapTable.Constructor,
      _initHeader = BootstrapTable.prototype.initHeader,
      colspans;
  BootstrapTable.prototype.initHeader = function () {
    var that = this;
    if (this.options.columns.length > 1){
      var count = 0, indicator = 0, header = that.options.columns[0], colspans = [];
      // 遍历所有options的columns
      $.each(this.options.columns, function (i, columns) {
          $.each(columns, function (j, column) {
            if(i === 0 && !column.field) {        // 第一行增加分组标识
              column.group = 'group_row' + i + '_column' + j;
              column.size = column.size || column.colspan;
              var clospan = {key: column.group, size: column.size, colspan: column.colspan, visible: 0};
              colspans.push(clospan);
            } else if (i > 0 && column.field) {   //第二行field增加分组标识
              count ++;
              if (count > colspans[indicator].size) {
                count = 0, indicator ++;
              }
              if (column.visible) {
                colspans[indicator].visible++;
              }
              column.group = colspans[indicator].key;
            }
          });
      });
      //更新 colspan
      $.each(colspans, function (index, item) {
        if (item.visible === 0) {
          hideColumn(header, item.key);
        } else if (item.visible !== item.colspan){
          if (item.visible === 1) {
            showColumn(header, item.key);
          }
        }
        updateColspan(header, item.key, item.visible);
      });
    }
    _initHeader.apply(this, Array.prototype.slice.apply(arguments));
  }
  function hideColumn(ref, group_name) {
    $.each(ref, function (index, item) {
      if (item.group === group_name) {
        item.visible = false;
      }
    });
  }
  function showColumn(ref, group_name) {
    $.each(ref, function (index, item) {
      if (item.group === group_name) {
        item.visible = true;
      }
    });
  }
  function updateColspan(ref, group_name, visible) {
    $.each(ref, function (index, item) {
      if (item.group === group_name) {
        item.colspan = visible;
      }
    });
  }
})();
