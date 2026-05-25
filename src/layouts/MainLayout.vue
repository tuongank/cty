<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="main-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="header-title">
          Tool Management System
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="main-drawer"
    >
      <q-list>
        <q-item-label header class="drawer-header">
          Navigation
        </q-item-label>

        <q-item
          clickable
          v-ripple
          to="/administration/master-registration"
          active-class="drawer-item-active"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Master Registration</q-item-label>
            <q-item-label caption>Administration</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss" scoped>
.main-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
}

.header-title {
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.main-drawer {
  background-color: #f8f9fc;
}

.drawer-header {
  font-weight: 700;
  color: #1a237e;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  padding-top: 20px;
}

.drawer-item-active {
  color: #1a237e;
  background: rgba(26, 35, 126, 0.08);
  font-weight: 600;
}
</style>
