const cookie = {
  read(name: string): string | null {
    // cookie 正则匹配
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))

    return match ? decodeURIComponent(match[3]) : null
  },
}

export default cookie
