<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AddUrlModal from './AddUrlModal.vue';
import EditUrlModal from './EditUrlModal.vue';

interface UrlItem {
  id: number;
  url: string;
  title: string;
  photo: string;
  clicks: number;
  pinned: boolean;
}

const urls = ref<UrlItem[]>([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingUrl = ref<UrlItem | null>(null);
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const filteredUrls = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return urls.value.filter(url => 
    url.title.toLowerCase().includes(query) || 
    url.url.toLowerCase().includes(query)
  );
});

const sortedUrls = computed(() => {
  return [...filteredUrls.value].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.clicks - a.clicks;
  });
});

function addUrl(newItem: UrlItem) {
  urls.value.push({ ...newItem, pinned: false });
}

function updateUrl(updatedItem: UrlItem) {
  const index = urls.value.findIndex(u => u.id === updatedItem.id);
  if (index !== -1) {
    urls.value[index] = updatedItem;
  }
}

function incrementClicks(id: number) {
  const url = urls.value.find(u => u.id === id);
  if (url) {
    url.clicks++;
  }
}

function togglePin(id: number) {
  const url = urls.value.find(u => u.id === id);
  if (url) {
    url.pinned = !url.pinned;
  }
}

function openAddModal() {
  showAddModal.value = true;
}

function closeAddModal() {
  showAddModal.value = false;
}

function openEditModal(url: UrlItem) {
  editingUrl.value = { ...url };
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  editingUrl.value = null;
}

onMounted(() => {
  searchInput.value?.focus();
});
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="mb-4">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Search URLs..."
        class="w-full p-2 border rounded"
      />
    </div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">URL List</h2>
      <button
        @click="openAddModal"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="mr-1" />
        Add URL
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="url in sortedUrls"
        :key="url.id"
        class="p-4 border rounded hover:bg-gray-100 flex flex-col relative"
        :class="{ 'border-blue-500': url.pinned }"
      >
        <div class="absolute top-2 right-2 flex space-x-2">
          <button
            @click="togglePin(url.id)"
            class="text-gray-500 hover:text-gray-700"
            :title="url.pinned ? 'Unpin' : 'Pin'"
          >
            <font-awesome-icon :icon="['fas', url.pinned ? 'thumbtack' : 'thumbtack']" :class="{ 'text-blue-500': url.pinned }" />
          </button>
          <button
            @click="openEditModal(url)"
            class="text-gray-500 hover:text-gray-700"
            title="Edit"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </button>
        </div>
        <div class="mb-2">
          <img v-if="url.photo" :src="url.photo" :alt="url.title" class="w-full h-32 object-cover rounded mb-2">
          <h3 v-if="url.title" class="font-bold truncate">{{ url.title }}</h3>
          <a
            v-else
            :href="url.url"
            target="_blank"
            rel="noopener noreferrer"
            @click="incrementClicks(url.id)"
            class="font-bold text-blue-600 hover:underline truncate"
          >
            {{ url.url }}
          </a>
        </div>
        <a
          v-if="url.title"
          :href="url.url"
          target="_blank"
          rel="noopener noreferrer"
          @click="incrementClicks(url.id)"
          class="text-blue-600 hover:underline truncate mb-2 text-sm"
        >
          {{ url.url }}
        </a>
      </div>
    </div>
  </div>
  <AddUrlModal v-if="showAddModal" @add="addUrl" @close="closeAddModal" />
  <EditUrlModal
    v-if="showEditModal"
    :url="editingUrl"
    @update="updateUrl"
    @close="closeEditModal"
  />
</template>