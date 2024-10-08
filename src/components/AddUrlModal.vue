<script setup lang="ts">
import { ref } from 'vue';

interface UrlItem {
  id: number;
  url: string;
  title: string;
  photo: string;
  clicks: number;
}

const newUrl = ref('');
const newTitle = ref('');
const newPhoto = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['add', 'close']);

function addUrl() {
  if (newUrl.value.trim() !== '') {
    const newItem: UrlItem = {
      id: Date.now(),
      url: newUrl.value,
      title: newTitle.value.trim(),
      photo: newPhoto.value,
      clicks: 0
    };
    emit('add', newItem);
    newUrl.value = '';
    newTitle.value = '';
    newPhoto.value = '';
    if (fileInput.value) fileInput.value.value = '';
    emit('close');
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      newPhoto.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Add New URL</h3>
        <div class="mt-2 px-7 py-3">
          <input
            v-model="newTitle"
            type="text"
            placeholder="Enter a title (optional)"
            class="w-full p-2 border rounded mb-3"
          />
          <input
            v-model="newUrl"
            @keyup.enter="addUrl"
            type="text"
            placeholder="Enter a new URL"
            class="w-full p-2 border rounded mb-3"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="w-full p-2 border rounded mb-3"
          />
          <img v-if="newPhoto" :src="newPhoto" alt="Uploaded photo" class="w-full h-32 object-cover rounded mb-3" />
        </div>
        <div class="items-center px-4 py-3">
          <button
            @click="addUrl"
            class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add URL
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>