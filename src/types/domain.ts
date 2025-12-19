/** Domain models used by the UI layer.*/

export type Character = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export type Comic = {
  id: number;
  title: string;
  imageUrl: string;
  coverDate: string | null;
};