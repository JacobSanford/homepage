<script setup lang="ts">
import { ref, watch } from 'vue';

interface UrlItem {
  id: number;
  url: string;
  title: string;
  photo: string;
  clicks: number;
  pinned: boolean;
}

const props = defineProps<{
  url: UrlItem | null;
}>();

const emit = defineEmits(['update', 'close']);

const editedUrl = ref<UrlItem>({
  id: 0,
  url: '',
  title: '',
  photo: '',
  clicks: 0,
  pinned: false
});

const fileInput = ref<HTMLInputElement | null>(null);

watch(() => props.url, (newUrl) => {
  if (newUrl) {
    editedUrl.value = { ...newUrl };
  }
}, { immediate: true });

function updateUrl() {
  emit('update', editedUrl.value);
  emit('close');
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      editedUrl.value.photo = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function togglePin() {
  editedUrl.value.pinned = !editedUrl.value.pinned;
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="edit-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Edit URL</h3>
        <div class="mt-2 px-7 py-3">
          <input
            v-model="editedUrl.title"
            type="text"
            placeholder="Enter a title (optional)"
            class="w-full p-2 border rounded mb-3 text-sm"
          />
          <input
            v-model="editedUrl.url"
            type="text"
            placeholder="Enter a URL"
            class="w-full p-2 border rounded mb-3 text-sm"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="w-full p-2 border rounded mb-3 text-sm"
          />
          <img v-if="editedUrl.photo" :src="editedUrl.photo" alt="URL photo" class="w-full h-32 object-cover rounded mb-3" />
          <p class="text-sm text-gray-600 mb-3">Clicks: {{ editedUrl.clicks }}</p>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-600">Pin to top:</span>
            <button
              @click="togglePin"
              class="px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              :class="{ 'bg-blue-500 text-white hover:bg-blue-600': editedUrl.pinned }"
            >
              {{ editedUrl.pinned ? 'Unpin' : 'Pin' }}
            </button>
          </div>
        </div>
        <div class="items-center px-4 py-3">
          <button
            @click="updateUrl"
            class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Update URL
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>