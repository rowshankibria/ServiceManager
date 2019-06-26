import { DetailPageAction } from "./components/titlebar/utilities";

export interface IDetailPage {

    /**
     *  save data
     */
    saveEntity(action: DetailPageAction): void;

    /**
    * redirect to list page
    */
    redirectToListPage(action: DetailPageAction): void;

    /**
     * validate and save data
     */
    validateAndSave(action: DetailPageAction): void;


    /**
     * on save button clicked
     */
    onSaveClicked(e): void;
    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(e): void;

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(e): void;

    /**
    * on close button clicked
    */
    onCloseClicked(e): void;
}
