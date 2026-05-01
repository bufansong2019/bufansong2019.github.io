<template>
  <div class="beaudar-comments" :key="theme">
    <!-- 加载提示 -->
    <div v-if="loading" class="beaudar-loading">💬 评论加载中...</div>

    <!-- Beaudar 脚本，@load 触发后延迟隐藏 loading -->
    <script src="https://beaudar.lipk.org/client.js"
            repo="bufansong2019/bufansong2019.github.io"
            branch="main"
            issue-term="pathname"
            :theme="theme"
            comment-order="desc"
            input-position="top"
            crossorigin="anonymous"
            emoji="true"
            lazy="true"
            async
            @load="onScriptLoad">
    </script>
  </div>
</template>

<script>
export default {
  data() {
    const isDark = (typeof document !== 'undefined' &&
      (document.documentElement.classList.contains('theme-mode-dark') ||
        document.body.classList.contains('theme-mode-dark')))
    return {
      theme: isDark ? 'github-dark' : 'github-light',
      loading: true, // 控制 loading 显示
      hideTimer: null // 用于延迟隐藏的计时器
    }
  },
  watch: {
    theme() {
      // 主题切换 → 重建评论区 → 立即显示 loading，并清除旧的延迟隐藏计时器
      this.loading = true
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
        this.hideTimer = null
      }
    }
  },
  mounted() {
    const observer = new MutationObserver(() => {
      const isDarkNow =
        document.documentElement.classList.contains('theme-mode-dark') ||
        document.body.classList.contains('theme-mode-dark')
      const newTheme = isDarkNow ? 'github-dark' : 'github-light'
      if (newTheme !== this.theme) {
        this.theme = newTheme
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    this.$once('hook:destroyed', () => {
      observer.disconnect()
      if (this.hideTimer) clearTimeout(this.hideTimer)
    })
  },
  methods: {
    onScriptLoad() {
      // 脚本加载完成后，延迟 800ms 再隐藏 loading
      this.hideTimer = setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>

<style scoped>
.beaudar-loading {
  text-align: center;
  color: var(--textColor);
  padding: 2rem;
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>