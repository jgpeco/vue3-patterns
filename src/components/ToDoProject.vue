<script setup>
import { ref, inject } from 'vue'
import todoService from '../services/todo'
import TodoItemForm from './TodoItemForm.vue'
import TodoList from './TodoList.vue'
import TodoFilter from './TodoFilter.vue'
import TodoSummary from './TodoSummary.vue'

const
  $modals = inject('$modals'),
  _filter = ref(''),
  _item = ref(todoService.getDefault()),
  _items = ref([])

function showModal(new_item = true, item = {}) {
  if (new_item) {
    _item.value = todoService.getDefault()
  } else {
    _item.value = todoService.makeCopy(item)
  }

  $modals.show('newEditItem').then(() => {
    if (new_item) {
      _items.value.push(_item.value)
    } else {
      let index = getIndex(item)
      if (index >= 0) {
        _items.value[index] = _item.value
      } else {
        alert('Error updating')
      }
    }
  }, () => {
      // TO DO: cancellation
  })

  function deleteItem(item) {
    $modals.show('deleteItem').then(() => {
      let index = getIndex(item)
      if (index >= 0) {
        _items.value.splice(index, 1)
      }
    }, () => {
      // TO DO: cancellation
    })
  }

  function getIndex(item) {
    let index = _items.value.findIndex(it => {
      return it.id === item.id
    })

    if (index === -1) {
      return false
    } else {
      return index
    }
  }

  function toggleStatus(item) {
    item.status = todoService.toggleStatus(item.status)
  }
}

</script>

<template>
  <div class="project-container">
    
    <!-- Summary -->
    <TodoSummary
      :items="_items"
      class="w3-margin-bottom"
    ></TodoSummary>

    <!-- Filter -->
    <div class="w3-margin-bottom">
      <TodoFilter
        v-model="_filter"
        class="flex-grow"
      ></TodoFilter>
    </div>

    <!-- List -->
    <TodoList
      v-model="_items"
      :filter="_filter"
      @toggle="toggleStatus"
      @edit="showModal(false, $event)"
      @delete="deleteItem"
    >
      <button 
        @click="showModal(true)"
        class="w3-button w3-blue w3-round-xxlarge"
      >
        <i class="fa-solid fa-square-plus"></i>
        New Item
      </button>
    </TodoList>

    <!-- Modals -->
    <Modal name="newEditItem" title="To-Do Item">
      <TodoItemForm v-model="_item"></TodoItemForm>
    </Modal>

    <Modal name="deleteItem" title="Delete To-Do item">
      <p>
        This action will delete the item:<br />
        <strong>{{ _item.text }}</strong>
      </p>
      <p class="w3-text-red w3-pale-red">
        This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>

<style scoped>
  .project-container {
    max-width: 56rem;
    padding: 1rem;
    margin: 0 auto;
  }
</style>