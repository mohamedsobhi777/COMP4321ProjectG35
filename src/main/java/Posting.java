public class Posting {

    private int termFrequency;

    public Posting() {
        termFrequency = 0;
    }

    public int getTermFrequency() {
        return termFrequency;
    }

    public void incrementTermFrequency() {
        termFrequency++;
    }

    public void setTermFrequency(int frequency) {
        termFrequency = frequency;
    }}
