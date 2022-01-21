<template>
  <div ref="component" class="ui-table">
    <div class="ui-table__wrapper" @mousedown="selectReset(null)">
      <table v-if="fields" ref="table" class="table" :class="blurred ? 'table--blurred' : null">
        <thead>
          <tr class="row row--th">
            <th v-for="(field, index) in fields" :key="index" ref="tableThs" class="cell cell--th" @mousedown="setSort(field.name)">
              <div class="cell__overflow">
                <span class="cell__content">{{ field.name }}</span>
              </div>
              <div v-if="isSortedField(field.name)" class="cell__arrow" :class="sorting.reverse ? 'cell__arrow--reverse' : ''">^</div>
              <div class="cell__grip" @mousedown.stop="gripMouseDown" @dblclick="adjustSingleColumn" />
            </th>
            <th ref="" class="cell cell--th cell--th-remainder" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in sortedRows"
            :key="index"
            :ref="`row-${index}`"
            :tabindex="index"
            class="row"
            :class="rowClasses(index)"
            @mousedown.exact.stop="selectOnly(index)"
            @mousedown.shift.exact.stop="selectTo(index, $event)"
            @mousedown.meta.stop="selectToggle(index)"
            @keydown.shift.up.exact="selectToAbove(index, $event)"
            @keydown.shift.down.exact="selectToBelow(index, $event)"
          >
            <td v-for="(item, itemIndex) in Object.keys(row)" :key="itemIndex" class="cell">
              <div class="cell__overflow">
                <span class="cell__content">{{ row[fields[itemIndex].name] }}</span>
              </div>
            </td>
            <td class="cell cell--td-remainder" />
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'

const initialGrip = {
  thElm:           null,
  startOffset:     null,
  startTableWidth: null,
}

export default {
  props: ['fields', 'rows'],
  data() {
    return {
      blurred:    true,
      scanAnchor: null,
      sorting:    {
        fieldName: null,
        reverse:   false,
      },
      grip:   { ...initialGrip },
      rowMap: new Map([]),
    }
  },
  computed: {
    sortedRows () {
      return this.rows
    },
  },
  watch: {
    rowMap: {
      deep: true,
      handler () {
        this.$emit('selected', this.rowMap.)
      },
    },
    rows: {
      immediate: true,
      deep:      true,
      handler (rows) {
        this.rowMap = new Map(this.rows.map((row, index) => [index, false]))
      },
    },
    fields: {
      immediate: true,
      deep:      true,
      handler () {
        if (this.fields.length === 0) {
          return
        }
        this.$nextTick(() => {
          this.initialColumnAdjust(this.$refs.tableThs)
        })
      },
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.gripMouseMove)
    document.addEventListener('mouseup', this.gripMouseUp)
    document.addEventListener('mousedown', this.deselectOnBlur)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.gripMouseMove)
    document.removeEventListener('mouseup', this.gripMouseUp)
    document.removeEventListener('mousedown', this.deselectOnBlur)
  },
  methods: {
    markFocus () {
      this.blurred = false
    },
    isSortedField (fieldName) {
      return this.sorting.fieldName === fieldName
    },
    setSort (fieldName) {
      if (this.sorting.fieldName === fieldName) {
        if (this.sorting.reverse) {
          this.sorting.fieldName = null
          this.sorting.reverse = false
        } else {
          this.sorting.reverse = true
        }
      } else {
        this.sorting.fieldName = fieldName
        this.sorting.reverse = false
      }
    },
    selectReset (blur = true) {
      this.selectedRowIndexes = new Map(this.rows.map((row, index) => [index, false]))
      if (blur) {
        this.scanAnchor = null
        this.blurred = true
      }
    },
    selectOnly (rowIndex) {
      this.selectReset(false)
      this.rowMap.set(rowIndex, true)
      this.scanAnchor = rowIndex
      this.blurred = false
    },
    selectToAbove(rowIndex, $event) {
      $event.target.closest('tr').previousSibling.focus()
      this.selectTo(rowIndex - 1, true)
    },
    selectToBelow(rowIndex, $event) {
      $event.target.closest('tr').nextSibling.focus()
      this.selectTo(rowIndex + 1, true)
    },
    selectTo (rowIndex, connectSiblings = false) {
      this.blurred = false
      
      if (this.scanAnchor === null) {
        // No rows selected, start from the top
        this.selectedRowIndexes = _.range(0, rowIndex + 1)
        return
      }

      this.scanRowsTo(rowIndex, true)
      this.scanRowsTo(rowIndex, false)
    },
    _isMovingInChosenDirection (from, to, incrementForward) {
      if (incrementForward) {
        return to > from
      }
      return to < from
    },
    _hasPassedChosen (scan, chosen, incrementForward) {
      if (incrementForward) {
        return scan > chosen
      }
      return scan < chosen
    },
    _scanner(scanRow) {
      const incrementer = incrementForward ? 1 : -1
      const endPosition = incrementForward ? 0 : this.rows.length
      let scanIndex = this.scanAnchor
      // Starting from the most recently selected row, crawl (forward, or backward)
      while (scanIndex !== endPosition) {
        scanIndex += incrementer
        if (!scanRow(scanIndex, chosenRowIndex, incrementForward)) {
          break
        }
      }
    },
    _scanDivergentRow (scanIndex, chosenRowIndex, incrementForward) {
      // Stop processing divergent rows at the first gap
      if (this.rowMap.get(scanIndex) === false) {
        return false
      }
      // Crawling away from the click event, let's delete any selected direct-siblings
      this.selectSet(scanIndex, false)
    },
    _scanConvergentRow (scanIndex, chosenRowIndex, incrementForward) {
      // Are we crawling towards in the direction of chosenRow from scanAnchor (even if we've passed it)
      // If our current scan is not selected
      if (!scanIndexSelectedVal) {
        if (!this.hasPassedChosen(scanIndex, chosenRowIndex, incrementForward)) {
          this.selectRow(scanIndex, true)
        } else if (this.rowMap.get(scanIndex)) {
          this.focusRow(scanIndex)
        } else {
          return false
        }
      } else if (this.hasPassed(scanIndex, chosenRowIndex, incrementForward)) {
        // The scanned row is selected, but we've passed the chosenRowIndex. We'll de-select it.
        this.setRowMapItem(scanIndex, false)
        this.rowMap.set(scanIndex, false)
      }
    },
    scanRowsTo (chosenRowIndex, incrementForward) {
      this._scanner((scanIndex, chosenRowIndex, incrementForward) => {
        if (this._isMovingInChosenDirection(scanIndex, incrementForward)) {
          return this._scanConvergentRow(scanIndex, chosenRowIndex, incrementForward)
        }
        if (this.isRowSelected(scanIndex)) {
          return this._scanDivergentRow(scanIndex, chosenRowIndex, incrementForward)
        }
        return false
      })
    },
    isRowSelected (scanIndex) {
      return this.rowMap.get(scanIndex)
    },
    selectSet (scanRow, value, focus) {
      this.rowMap.set(scanIndex, true)
      if (focus) {
        this.focusRow(scanIndex)
      }
    },
    selectToggle (rowIndex) {
      this.blurred = false
      this.rowMap.set(rowIndex, !this.rowMap.get(rowIndex))
      this.scanAnchor = rowIndex
    },
    rowClasses(rowIndex) {
      return [
        this.rowMap.get(rowIndex) ? 'row--selected selected' : null,
      ]
    },
    adjustSingleColumn(e) {
      const thElm = e.target.closest('.cell')
      this.initialColumnAdjust([thElm])
    },
    initialColumnAdjust(columns) {
      if (!Array.isArray(columns)) {
        columns = [columns]
      }
      let totalThWidth = 0
      columns.forEach(th => {
        if (th.classList.contains('cell--th-remainder')) {
          th.style.width = 'auto'
          return
        }
        const thWidth = th.querySelector('div > span').offsetWidth
        totalThWidth += thWidth
        th.style.width = thWidth + 15 + 'px'
      })
      this.$refs.table.style.width = totalThWidth + 'px'
    },
    gripMouseDown(e) {
      document.body.classList.add('dragging')
      const thElm = e.target.closest('.cell')
      this.grip.thElm = thElm
      this.grip.startOffset = thElm.offsetWidth - e.pageX
      this.grip.startTableWidth = this.$refs.table.offsetWidth - e.pageX
    },
    gripMouseMove(e) {
      if (this.grip.thElm && this.grip.startOffset) {
        if (e.pageX > 30 + Math.abs(this.grip.startOffset)) {
          const remainder = this.$refs.tableThs[this.$refs.tableThs.length - 1]
          this.grip.thElm.style.width = this.grip.startOffset + e.pageX + 'px'
          this.$refs.table.style.width = (this.grip.startTableWidth  - remainder.offsetWidth) + e.pageX + 'px'
        }
      }
    },
    gripMouseUp() {
      document.body.classList.remove('dragging')
      this.grip = { ...initialGrip }
    },
    deselectOnBlur(e) {
      if (!e.path.find(path => path === this.$refs.component)) {
        this.blurred = true
      }
    },
    focusRow(rowIndex) {
      this.$refs[`row-${rowIndex}`][0].focus()
    },
  },
}
</script>

<style lang="scss" scoped>
.ui-table {
  display: flex;
  flex-direction: column;
}
.ui-table__wrapper {
  flex-grow: 1;
  box-shadow: inset 0px 0 10px -8px black;
  background: linear-gradient(
    to bottom,
    white,
    white 50%,
    #f7f7f7 50%,
    #f7f7f7
  );
  background-size: 100% 40px;
  background-position: 0 20px;
  overflow: scroll;
  user-select: none;
  position: relative;
}
.table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  min-width: 100%;
  font-size: 0.9rem;
  position: absolute;
  top: 0;
  &--blurred {
    .row--selected {
      background: #b9b9b9;
    }
  }
}
tbody {
  background: linear-gradient( to bottom, white, white 50%, #f7f7f7 50%, #f7f7f7 );
  background-size: 100% 40px;
}
tbody td,
thead th {
  border-spacing: 0;
  border: 0;
  padding: 0;
  margin: 0;
  height: 20px;
  line-height: 20px;
  text-align: left;
  padding: 0 0.5rem;
  cursor: default;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 30px;
}
.cell__overflow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  height: inherit;
}
.cell--th .cell__overflow:active {
  background: #efefef;
}
.cell--th .cell__overflow:active {
  background: #efefef;
}
tr {
  outline: none;
}
.row {
  &--selected {
    background: $highlight-color;
    color: white;
    .cell {
      border-bottom: 1px solid white;
    }
  }
  &--th {
    box-shadow: 0 0 8px -3px black;
  }
}

.cell {
  border-bottom: 1px solid transparent;
  &--th {
    background: linear-gradient(to bottom, white, whitesmoke);
    border-bottom: 1px solid #d2d2d2;
    font-weight: normal;
    z-index: 1;
    position: sticky;
    top: 0;
  }
  &__content {
    display: inline-block;
    padding: 0 5px;
  }
  &__arrow {
    position: absolute;
    right: 8px;
    top: 1px;
    &--reverse {
      transform: rotateX(180deg);
      top: -3px;
    }
  }
}
.cell__grip {
  top: 0;
  right: 0;
  bottom: 0;
  width: 5px;
  position: absolute;
  cursor: col-resize;
  background: red;
  background: linear-gradient(to right, transparent, #efefef);
  border-right: 1px solid #dadada;
}
</style>
