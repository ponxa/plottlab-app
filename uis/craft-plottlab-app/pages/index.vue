<template>
  <div>
    <div>
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <article>
      <table>
        <tr
          v-for="(row, rowIndex) in activeData"
          :key="activeTab + '-row-' + rowIndex"
        >
          <td
            v-for="(column, columnIndex) in row"
            :key="activeTab + '-column-' + columnIndex"
          >
            {{ column }}
          </td>
        </tr>
      </table>
    </article>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const tabs = ['Tab 1', 'Tab 2', 'Tab 3']; // Add more tabs as needed
const activeTab = ref(tabs[0]);

// Separate data for each tab
const tab1Data = [
  ['Tab 1 Row 1 Column 1', 'Tab 1 Row 1 Column 2', 'Tab 1 Row 1 Column 3'],
  ['Tab 1 Row 2 Column 1', 'Tab 1 Row 2 Column 2', 'Tab 1 Row 2 Column 3'],

  // Add more rows as needed
];

const tab2Data = [
  ['Tab 2 Row 1 Column 1', 'Tab 2 Row 1 Column 2', 'Tab 2 Row 1 Column 3'],
  ['Tab 2 Row 2 Column 1', 'Tab 2 Row 2 Column 2', 'Tab 2 Row 2 Column 3'],
  // Add more rows as needed
];

const tab3Data = [
  ['Tab 3 Row 1 Column 1', 'Tab 3 Row 1 Column 2', 'Tab 3 Row 1 Column 3'],
  ['Tab 3 Row 2 Column 1', 'Tab 3 Row 2 Column 2', 'Tab 3 Row 2 Column 3'],
  // Add more rows as needed
];

// Computed property to switch data based on active tab
const activeData = computed(() => {
  switch (activeTab.value) {
    case 'Tab 1':
      return tab1Data;
    case 'Tab 2':
      return tab2Data;
    case 'Tab 3':
      return tab3Data;
    // Add more cases as needed
    default:
      return [];
  }
});
</script>

<style scoped>
button {
  margin-right: 10px;
}

button:active {
  color: blue;
}

table {
  width: 100%;
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
