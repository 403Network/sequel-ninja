<template>
  <div class="ui-table">
    <div class="ui-table__wrapper" @mousedown="selectReset(null)">
      <table v-if="fields" ref="table" class="table">
        <thead>
          <tr class="row row--th">
            <th v-for="(field, index) in fields" :key="index" ref="tableThs" class="cell cell--th" @mousedown="setSort(field.name)">
              <div class="cell__overflow">
                <span class="cell__content">{{ field.name }}</span>
              </div>
              <div v-if="isSortedField(field.name)" class="cell__arrow" :class="sorting.reverse ? 'cell__arrow--reverse' : ''">
                ^
              </div>
              <div class="cell__grip" @mousedown.stop="gripMouseDown" @dblclick="adjustSingleColumn" />
            </th>
            <th ref="" class="cell cell--th cell--th-remainder" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in sortedRows" :key="index" :tabindex="index" class="row" :class="rowClasses(index)" @mousedown.exact.stop="selectOnly(index)" @mousedown.shift.exact.stop="selectTo(index)" @mousedown.meta.stop="selectToggle(index)">
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
      selectedRowIndexes: [],
      mostRecentRowIndex: null,
      sorting:            {
        fieldName: null,
        reverse:   false,
      },
      grip: { ...initialGrip },
    }
  },
  computed: {
    sortedRows() {
      if (!this.sorting.fieldName) {
        return this.rows
      }
      const left = this.sorting.reverse ? -1 : 1
      const right = this.sorting.reverse ? 1 : -1
      return [...this.rows].sort((a, b) => {
        return a[this.sorting.fieldName] > b[this.sorting.fieldName]
          ? left
          : right
      })
    },
  },
  watch: {
    fields: {
      immediate: true,
      deep:      true,
      handler:   function() {
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
    isSortedField(fieldName) {
      return this.sorting.fieldName === fieldName
    },
    setSort(fieldName) {
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
    selectReset() {
      this.selectedRowIndexes = []
      this.mostRecentRowIndex = null
    },
    selectOnly(rowIndex) {
      this.selectedRowIndexes = [rowIndex]
      this.mostRecentRowIndex = rowIndex
    },
    selectTo(rowIndex) {
      // const findRow = this.selectedRowIndexes.findIndex(selectedRowIndex => selectedRowIndex === rowIndex)
      if (this.mostRecentRowIndex === null) {
        // No rows selected, start from the top
        this.selectedRowIndexes = _.range(0, rowIndex + 1)
        return
      }

      let loopForward = this.mostRecentRowIndex + 1
      while (loopForward < this.sortedRows.length) {
        const loopForwardSelected = this.selectedRowIndexes.findIndex(
          index => index === loopForward,
        )
        // If the row clicked is higher than the most recently clicked row
        if (rowIndex > this.mostRecentRowIndex) {
          if (loopForwardSelected === -1) {
            if (loopForward <= rowIndex) {
              this.selectedRowIndexes.push(loopForward)
              if (loopForward == rowIndex) {
                break
              }
            } else {
              break
            }
          } else if (loopForward > rowIndex) {
            Vue.delete(this.selectedRowIndexes, loopForwardSelected)
          }
        } else if (loopForwardSelected > -1) {
          Vue.delete(this.selectedRowIndexes, loopForwardSelected)
        } else {
          break
        }
        loopForward++
      }

      let loopBackward = this.mostRecentRowIndex - 1
      while (loopBackward > -1) {
        const loopBackwardSelected = this.selectedRowIndexes.findIndex(
          index => index === loopBackward,
        )
        if (rowIndex < this.mostRecentRowIndex) {
          if (loopBackwardSelected === -1) {
            if (loopBackward >= rowIndex) {
              this.selectedRowIndexes.push(loopBackward)
              if (loopBackward == rowIndex) break
            } else {
              break
            }
          } else if (loopBackward < rowIndex) {
            Vue.delete(this.selectedRowIndexes, loopBackwardSelected)
          }
        } else if (loopBackwardSelected > -1) {
          Vue.delete(this.selectedRowIndexes, loopBackwardSelected)
        } else {
          break
        }
        loopBackward--
      }
    },
    selectToggle(rowIndex) {
      const findRow = this.selectedRowIndexes.findIndex(
        selectedRowIndex => selectedRowIndex === rowIndex,
      )
      if (findRow > -1) {
        this.selectedRowIndexes.splice(findRow, 1)
        // The rows have been shifted -1
        // Higher than the one we've selected

        if (
          this.selectedRowIndexes.findIndex(sIndex => sIndex === rowIndex + 1) >
          -1
        ) {
          this.mostRecentRowIndex = rowIndex + 1
        } else if (
          this.selectedRowIndexes.findIndex(sIndex => sIndex === rowIndex - 1) >
          -1
        ) {
          this.mostRecentRowIndex = rowIndex - 1
        }
      } else {
        this.selectedRowIndexes.push(rowIndex)
        this.mostRecentRowIndex = rowIndex
      }
    },
    rowClasses(rowIndex) {
      return [
        this.selectedRowIndexes.findIndex(
          selectedRowIndex => selectedRowIndex === rowIndex,
        ) > -1
          ? 'row--selected selected'
          : null,
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
      this.grip = { ...initialGrip }
    },
    deselectOnBlur() {
      this.selectedRowIndexes = []
    },
  },
}
</script>

<style scoped>
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
  overflow: scroll;
  user-select: none;
  position: relative;
}
table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  min-width: 100%;
  font-size: 0.9rem;
  position: absolute;
  top: 0;
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
}
.row--selected {
  background: #dc56a7;
  color: white;
}
.row--th {
  box-shadow: 0 0 8px -3px black;
}
.cell {
}
.cell--th {
  background: linear-gradient(to bottom, white, whitesmoke);
  border-bottom: 1px solid #d2d2d2;
  font-weight: normal;
  z-index: 1;
  position: sticky;
  top: 0;
}
.cell__content {
  display: inline-block;
  padding: 0 5px;
}
.cell__arrow {
  position: absolute;
  right: 8px;
  top: 1px;
}
.cell__arrow--reverse {
  transform: rotateX(180deg);
  top: -3px;
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
