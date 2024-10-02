

export const initRooms = () => {
  const cards = document.querySelectorAll(".card");
  let isFancyboxInitialized = false;

  cards.forEach((card) => {
    const cardId = card.id;
    const dialogId = cardId.replace("card", "dialog");
    const dialog = document.getElementById(dialogId) as HTMLDialogElement;
    const closeBtn = dialog.querySelector(".detail__close") as HTMLButtonElement;
    const galleryItem = dialog.querySelector(".gallery__item") as HTMLButtonElement;

    if (closeBtn) {
      card.addEventListener("click", () => {
        if (!isFancyboxInitialized) {
          import ("@fancyapps/ui/dist/fancybox/fancybox.css");
          import("@fancyapps/ui").then(({ Fancybox }) => {
            Fancybox.bind("[data-fancybox]", {});
            console.log("Fancybox initialized");
          });
          isFancyboxInitialized = true;
        }
        dialog.showModal();
      });

      closeBtn.addEventListener("click", () => {
        dialog.close();
      });

      galleryItem.addEventListener("click", () => {
        dialog.close();
      });

      dialog.addEventListener("cancel", () => {
        dialog.close();
      });
    } else {
      console.error(`Close button not found for dialog ${dialogId}`);
    }
  });
}