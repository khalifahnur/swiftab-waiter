import { create } from 'zustand';

interface StoreState {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const useStore = create<StoreState>((set) => ({
  selectedTab: "All",
  setSelectedTab: (tab) => set({ selectedTab: tab }),

}));

export default useStore;
