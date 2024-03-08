export interface QuestionnaireQuestion {
  id: number;
  question: string;
  isRecoded: boolean;
  isRating: boolean;
  fragetext: string | null;
}

export interface QuestionnaireScale {
  name: string;
  value: number;
}

type QuestionnaireFillingFrequency =
  | 'daily'
  | 'weekly'
  | 'biWeekly'
  | 'monthly'
  | 'quarterly';

type QuestionnaireAllocationOptions =
  | 'allClients'
  | 'newClients'
  | 'manual'
  | 'unallocated';

interface QuestionnaireClientAssigned {
  _id: string;
  Vorname: string;
  Nachname: string;
  excludeInQuestionnaire?: boolean;
}

class QuestionnaireModel {
  public _id: string = '';
  public userId: string = '';
  public name: string = 'Fragebogenname';
  public questions: QuestionnaireQuestion[] = [];
  public randomizeQuestions: boolean = false;
  public scale: QuestionnaireScale[] = [
    { name: 'nie', value: 0 },
    { name: 'selten', value: 1 },
    { name: 'manchmal', value: 2 },
    { name: 'häufig', value: 3 },
    { name: 'immer', value: 4 },
  ];
  public creationDate: Date = new Date();
  public fillingFrequency: QuestionnaireFillingFrequency = 'monthly';
  public allocatedTo: QuestionnaireAllocationOptions = 'unallocated';
  public clientsAssigned: QuestionnaireClientAssigned[] = [];

  constructor(init?: Partial<QuestionnaireModel>) {
    Object.assign(this, init);
  }
}

export default QuestionnaireModel;
