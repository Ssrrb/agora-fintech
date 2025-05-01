export async function $fetch<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init)
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<T>
  }
  