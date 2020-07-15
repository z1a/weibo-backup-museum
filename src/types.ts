export interface WeiboPage {
  data: {
    cards: WeiboCard[]
    cardlistInfo: WeiboCardListInfo
  }
}

export interface WeiboCardListInfo {
  total: number
  /**
   * The ID of the next item that is not included in this list
   */
  since_id: string
}

export interface WeiboCard {
  card_type: number
  mblog: WeiboPost
}

export interface WeiboPost {
  created_at: string
  text: string
  user: WeiboUser
  id: string
  pics?: WeiboPic[]
  retweeted_status?: WeiboPost
  // The next (older) post of the same user
  // Retweeted posts usually don't have it
  museum_next_id?: string
  museum_is_earliest_post?: boolean
}

interface WeiboPic {
  pid: string
  url: string
  large: {
    url: string
  }
}

export interface MuseumPost
  extends Omit<WeiboPost, "user" | "retweeted_status"> {
  museum_created_at_unix: number
  museum_user_id: string
  museum_retweeted_status_id?: string
  museum_retweeted_user_id?: string
}

export interface WeiboUser {
  id: string
  screen_name: string
  description: string
}

export enum Mode {
  backup,
  browse,
}

export interface MuseumConfig {
  currentUID: string
}

export enum BackupEvent {
  fetchUidStart,
  prefetchStart,
  prefetchFinish,
  fetchStart,
  fetchFinish,
  postFetchStart,
  postFetchFinish,
}
